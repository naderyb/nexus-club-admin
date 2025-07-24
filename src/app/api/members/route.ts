import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ POST — Add a new member
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nom = formData.get("nom")?.toString()?.trim() ?? "";
    const email = formData.get("email")?.toString()?.trim() ?? "";
    const role = formData.get("role")?.toString()?.trim() ?? "";
    const phone = formData.get("phone")?.toString()?.trim() ?? "";

    // Validate required fields
    if (!nom || !email || !role || !phone) {
      return NextResponse.json(
        { error: "All fields (nom, email, role, phone) are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const imageFile = formData.get("profile_picture");
    let profile_picture_url = "/default-profile.png"; 

    if (imageFile && typeof imageFile === "object" && "name" in imageFile) {
      profile_picture_url = `/public/${imageFile.name}`; 
    }

    const result = await pool.query(
      `INSERT INTO members (nom, email, role, profile_picture_url, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nom, email, role, profile_picture_url, phone]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: unknown) {
    console.error("❌ POST /api/members error:", err);

    // Handle specific database errors
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      // Unique constraint violation
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// ✅ GET — Fetch all members
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY id ASC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ GET /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// ✅ PUT — Update a member
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const nom = formData.get("nom")?.toString()?.trim() ?? "";
    const email = formData.get("email")?.toString()?.trim() ?? "";
    const role = formData.get("role")?.toString()?.trim() ?? "";
    const phone = formData.get("phone")?.toString()?.trim() ?? "";

    // Validate required fields
    if (!nom || !email || !role || !phone) {
      return NextResponse.json(
        { error: "All fields (nom, email, role, phone) are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const imageFile = formData.get("profile_picture");
    let profile_picture_url = "/default-profile.png";

    if (imageFile && typeof imageFile === "object" && "name" in imageFile) {
      profile_picture_url = `/public/${imageFile.name}`;
    }

    const result = await pool.query(
      `UPDATE members
       SET nom = $1, email = $2, role = $3, profile_picture_url = $4, phone = $5
       WHERE id = $6 RETURNING *`,
      [nom, email, role, profile_picture_url, phone, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: unknown) {
    console.error("❌ PUT /api/members error:", err);

    // Handle specific database errors
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      // Unique constraint violation
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete a member by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
