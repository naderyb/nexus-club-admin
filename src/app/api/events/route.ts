// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import client from "@/lib/db";

export const dynamic = "force-dynamic"; // Needed for file upload

// 👇 Add this helper at the top of the file
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // or specify domain
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// GET: Fetch all events
export async function GET() {
  try {
    const result = await client.query(
      "SELECT * FROM events ORDER BY date DESC"
    );
    return withCORS(NextResponse.json(result.rows));
  } catch (error) {
    console.error("GET /api/events error:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    ));
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
      INSERT INTO events (title, date, location, image_urls)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, date, location, imageUrls];

    const result = await client.query(query, values);

    return withCORS(NextResponse.json({
      message: "Event created",
      event: result.rows[0],
    }));
  } catch (error) {
    console.error("POST /api/events error:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    ));
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

    const images = formData.getAll("images") as File[];
    let imageUrls: string[] = [];

    if (!id) {
      return withCORS(NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      ));
    }

    const eventCheck = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventCheck.rowCount === 0) {
      return withCORS(NextResponse.json({ error: "Event not found" }, { status: 404 }));
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
      UPDATE events
      SET title = $1, date = $2, location = $3, image_urls = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [title, date, location, imageUrls, id];

    const result = await client.query(query, values);

    return withCORS(NextResponse.json({
      message: "Event updated successfully",
      event: result.rows[0],
    }));
  } catch (error) {
    console.error("Error updating event:", error);
    return withCORS(NextResponse.json({ error: "An error occurred" }, { status: 500 }));
  }
}

// DELETE: Delete an event
=) yh
// OPTIONS: Handle preflight requests for CORS
export async function OPTIONS() {
  return withCORS(NextResponse.json({ message: "CORS preflight response" }));
}length hkg nbjul,i
*t'dzvC XSQb

c xasW
ùkv nb;:,

mùl!hj













