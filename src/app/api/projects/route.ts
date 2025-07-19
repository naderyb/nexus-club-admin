// Backend - src/app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nexus",
  password: "nader@2000",
  port: 5432,
});

export async function GET() {
  try {
    const res = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    return NextResponse.json({ projects: res.rows }, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    console.log("POST form fields:", {
      name: form.get("name"),
      description: form.get("description"),
      status: form.get("status"),
      start_date: form.get("start_date"),
      end_date: form.get("end_date"),
      site_url: form.get("site_url"),
      image: form.get("image"),
    });

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const status = form.get("status") as string;
    const start_date = form.get("start_date") as string;
    const end_date = form.get("end_date") as string;
    const site_url = form.get("site_url") as string;
    const image = form.get("image") as File | null;

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

    let image_url = "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${randomUUID()}_${image.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      image_url = `/uploads/${fileName}`;
    }

    const insertQuery = `
      INSERT INTO projects (name, description, status, start_date, end_date, image_url, site_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      name,
      description,
      status,
      start_date,
      end_date,
      image_url,
      site_url,
    ];
    const result = await pool.query(insertQuery, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const form = await req.formData();
    const id = parseInt(form.get("id") as string, 10);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const status = form.get("status") as string;
    const start_date = form.get("start_date") as string;
    const end_date = form.get("end_date") as string;
    const site_url = form.get("site_url") as string;

    const image = form.get("image") as File | null;

    // Log the form data for debugging
    console.log({
      id,
      name,
      description,
      status,
      start_date,
      end_date,
      site_url,
      image: image ? image.name : null,
    });

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

    let image_url = "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${randomUUID()}_${image.name}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      image_url = `/uploads/${fileName}`;
    }

    const updateQuery = `
        UPDATE projects SET
        name = $1,
        description = $2,
        status = $3,
        start_date = $4,
        end_date = $5,
        image_url = $6,
        site_url = $7
        WHERE id = $8
        RETURNING *;
      `;

    const values = [
      name,
      description,
      status,
      start_date,
      end_date,
      image_url,
      site_url,
      id,
    ];

    const result = await pool.query(updateQuery, values);
    console.log("Update row count:", result.rowCount);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No project updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Log incoming request body
    const { name } = await req.json();
    console.log("Received DELETE request with name:", name);

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const deleteQuery = "DELETE FROM projects WHERE name = $1 RETURNING *";
    const values = [name];
    const result = await pool.query(deleteQuery, values);

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
