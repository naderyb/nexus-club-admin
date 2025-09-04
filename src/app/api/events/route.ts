// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import client from "@/lib/db";
import { authenticateAdmin, createUnauthorizedResponse } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// Cloudinary upload helper
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto", // Auto-detect image/video
          quality: "auto",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}

// GET: Fetch all events
export async function GET() {
  try {
    const result = await client.query(
      "SELECT id, title, description, date, location, media FROM public.events ORDER BY date DESC"
    );
    return withCORS(NextResponse.json(result.rows));
  } catch (error) {
    console.error("GET /api/events error:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    );
  }
}

// POST: Create new event with media uploads
export async function POST(req: Request) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;

    // Validate required fields
    if (!title || !date || !location) {
      return withCORS(
        NextResponse.json(
          { error: "Title, date, and location are required" },
          { status: 400 }
        )
      );
    }

    // Handle media uploads
    const mediaFiles = formData.getAll("media") as File[];
    const mediaUrls: string[] = [];

    if (mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        if (file.size > 0) {
          try {
            const url = await uploadToCloudinary(file, "nexus/events");
            mediaUrls.push(url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            // Continue with other files instead of failing completely
          }
        }
      }
    }

    const query = `
      INSERT INTO public.events (title, description, date, location, media)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      title,
      description,
      date,
      location,
      JSON.stringify(mediaUrls),
    ];

    const result = await client.query(query, values);

    return withCORS(
      NextResponse.json({
        message: "Event created successfully",
        event: { ...result.rows[0], media: mediaUrls },
      })
    );
  } catch (error) {
    console.error("POST /api/events error:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    );
  }
}

// PUT: Update an event
export async function PUT(req: Request) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;

    if (!id || !title || !date || !location) {
      return withCORS(
        NextResponse.json(
          { error: "ID, title, date, and location are required" },
          { status: 400 }
        )
      );
    }

    // Check if event exists and get current media
    const eventCheck = await client.query(
      "SELECT media FROM public.events WHERE id = $1",
      [id]
    );

    if (eventCheck.rowCount === 0) {
      return withCORS(
        NextResponse.json({ error: "Event not found" }, { status: 404 })
      );
    }

    // Get existing media or start with empty array
    let mediaUrls: string[] = [];
    try {
      mediaUrls = eventCheck.rows[0].media || [];
    } catch {
      mediaUrls = [];
    }

    // Handle new media uploads
    const newMediaFiles = formData.getAll("media") as File[];
    const replaceMedia = formData.get("replaceMedia") === "true";

    if (replaceMedia) {
      mediaUrls = []; // Clear existing media if replacing
    }

    if (newMediaFiles.length > 0) {
      for (const file of newMediaFiles) {
        if (file.size > 0) {
          try {
            const url = await uploadToCloudinary(file, "nexus/events");
            mediaUrls.push(url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }
      }
    }

    const query = `
      UPDATE public.events
      SET title = $1, description = $2, date = $3, location = $4, media = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [
      title,
      description,
      date,
      location,
      JSON.stringify(mediaUrls),
      id,
    ];

    const result = await client.query(query, values);

    return withCORS(
      NextResponse.json({
        message: "Event updated successfully",
        event: { ...result.rows[0], media: mediaUrls },
      })
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    );
  }
}

// DELETE: Delete an event
export async function DELETE(req: Request) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    let id: string | null = null;

    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      const url = new URL(req.url);
      id = url.searchParams.get("id");
    }

    if (!id) {
      return withCORS(
        NextResponse.json({ error: "Event ID is required" }, { status: 400 })
      );
    }

    const eventCheck = await client.query(
      "SELECT * FROM public.events WHERE id = $1",
      [id]
    );

    if (eventCheck.rowCount === 0) {
      return withCORS(
        NextResponse.json({ error: "Event not found" }, { status: 404 })
      );
    }

    await client.query("DELETE FROM public.events WHERE id = $1", [id]);

    return withCORS(
      NextResponse.json({ message: "Event deleted successfully" })
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return withCORS(NextResponse.json({ message: "CORS preflight response" }));
}
