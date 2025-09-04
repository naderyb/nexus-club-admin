// Backend - src/app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import Client from "@/lib/db";
import { authenticateAdmin, createUnauthorizedResponse } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// Cloudinary upload helper
async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
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

export async function GET() {
  try {
    const res = await Client.query(
      "SELECT id, name, description, status, start_date, end_date, site_url, media FROM public.projects ORDER BY id DESC"
    );

    // Parse media JSON for each project
    const projects = res.rows.map((project) => ({
      ...project,
      media: project.media || [],
    }));

    return NextResponse.json({ projects }, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const form = await req.formData();

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const status = form.get("status") as string;
    const start_date = form.get("start_date") as string;
    const end_date = form.get("end_date") as string;
    const site_url = form.get("site_url") as string;

    if (
      !name ||
      !description ||
      !status ||
      !start_date ||
      !end_date ||
      !site_url
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle media uploads
    const mediaFiles = form.getAll("media") as File[];
    const mediaUrls: string[] = [];

    if (mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        if (file.size > 0) {
          try {
            const url = await uploadToCloudinary(file, "nexus/projects");
            mediaUrls.push(url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }
      }
    }

    const insertQuery = `
      INSERT INTO public.projects (name, description, status, start_date, end_date, site_url, media)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      name,
      description,
      status,
      start_date,
      end_date,
      site_url,
      JSON.stringify(mediaUrls),
    ];
    const result = await Client.query(insertQuery, values);

    return NextResponse.json(
      { ...result.rows[0], media: mediaUrls },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const form = await req.formData();
    const id = parseInt(form.get("id") as string, 10);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const status = form.get("status") as string;
    const start_date = form.get("start_date") as string;
    const end_date = form.get("end_date") as string;
    const site_url = form.get("site_url") as string;

    if (
      !id ||
      !name ||
      !description ||
      !status ||
      !start_date ||
      !end_date ||
      !site_url
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get existing media
    const projectCheck = await Client.query(
      "SELECT media FROM public.projects WHERE id = $1",
      [id]
    );

    if (projectCheck.rowCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let mediaUrls: string[] = [];
    try {
      mediaUrls = projectCheck.rows[0].media || [];
    } catch {
      mediaUrls = [];
    }

    // Handle new media uploads
    const newMediaFiles = form.getAll("media") as File[];
    const replaceMedia = form.get("replaceMedia") === "true";

    if (replaceMedia) {
      mediaUrls = [];
    }

    if (newMediaFiles.length > 0) {
      for (const file of newMediaFiles) {
        if (file.size > 0) {
          try {
            const url = await uploadToCloudinary(file, "nexus/projects");
            mediaUrls.push(url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }
      }
    }

    const updateQuery = `
      UPDATE public.projects SET
      name = $1,
      description = $2,
      status = $3,
      start_date = $4,
      end_date = $5,
      site_url = $6,
      media = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      name,
      description,
      status,
      start_date,
      end_date,
      site_url,
      JSON.stringify(mediaUrls),
      id,
    ];
    const result = await Client.query(updateQuery, values);

    return NextResponse.json(
      { ...result.rows[0], media: mediaUrls },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const deleteQuery =
      "DELETE FROM public.projects WHERE name = $1 RETURNING *";
    const result = await Client.query(deleteQuery, [name]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Project deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
