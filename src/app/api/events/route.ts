// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import client from "@/lib/db";

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

// GET: Fetch all events
export async function GET() {
  try {
    const result = await client.query(
      "SELECT * FROM public.events ORDER BY date DESC"
    );
    return withCORS(NextResponse.json(result.rows));
  } catch (error) {
    console.error("GET /api/events error:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    );
  }
}

// POST: Create new event with multiple file uploads (images and video)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;

    

    const images = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (images.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        console.log("Creating uploads directory...");
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const image of images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);
        console.log(`Saving image to: ${filePath}`);
        fs.writeFileSync(filePath, buffer);
        imageUrls.push(`/uploads/${fileName}`);
      }
    }

    const query = `
      INSERT INTO public.events (title, date, location, image_urls)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, date, location, imageUrls];

    const result = await client.query(query, values);

    return withCORS(
      NextResponse.json({
        message: "Event created",
        event: result.rows[0],
      })
    );
  } catch (error) {
    console.error("POST /api/events error:", error);
    return withCORS(
      NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    );
  }
}

// PUT: Update an event with multiple image uploads
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;

    if (!date || date.trim() === "") {
      return withCORS(
        NextResponse.json(
          { error: "Date is required and must be valid" },
          { status: 400 }
        )
      );
    }

    const images = formData.getAll("images") as File[];
    let imageUrls: string[] = [];

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

    if (images.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      for (const image of images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        imageUrls.push(`/uploads/${fileName}`);
      }
    } else {
      imageUrls = eventCheck.rows[0].image_urls;
    }

    const query = `
      UPDATE public.events
      SET title = $1, date = $2, location = $3, image_urls = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [title, date, location, imageUrls, id];

    const result = await client.query(query, values);

    return withCORS(
      NextResponse.json({
        message: "Event updated successfully",
        event: result.rows[0],
      })
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return withCORS(
      NextResponse.json({ error: "An error occurred" }, { status: 500 })
    );
  }
}

// DELETE: Delete an event
export async function DELETE(req: Request) {
  try {
    let id: string | null = null;

    // Try to get ID from JSON body
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      // Fallback: try from query params
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
      NextResponse.json({ error: "An error occurred" }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return withCORS(NextResponse.json({ message: "CORS preflight response" }));
}
