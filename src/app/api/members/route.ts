import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticateAdmin, createUnauthorizedResponse } from "@/lib/auth";

// ✅ Updated valid roles array including Master Financier
const VALID_ROLES = [
  "president",
  "vice-president",
  "general secretary",
  "finance respo", 
  "finance assistante",
  "event manager", 
  "respo com",
  "respo logistics",
  "respo marketing",
  "respo dev",
  "respo rel-ex",
  "membre comm",
  "membre logistics",
  "membre dev",
  "membre marketing",
  "membre rel-ex",
  "alumni",
];

// POST — Add a new member
export async function POST(req: NextRequest) {
  // 🔒 Authentication check
  const { authenticated } = await authenticateAdmin();
  if (!authenticated) {
    return createUnauthorizedResponse("Authentication required to add members");
  }

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

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
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

    // Get the next display_order value
    const orderResult = await pool.query(
      "SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM members"
    );
    const display_order = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO members (nom, email, role, profile_picture_url, phone, display_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nom, email, role, profile_picture_url, phone, display_order]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/members error:", err);

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

// GET — Fetch all members (ordered by display_order)
export async function GET() {
  // Authentication check
  const { authenticated } = await authenticateAdmin();
  if (!authenticated) {
    return createUnauthorizedResponse(
      "Authentication required to view members"
    );
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.members ORDER BY COALESCE(display_order, id) ASC"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// PUT — Update a member
export async function PUT(req: NextRequest) {
  // Authentication check
  const { authenticated } = await authenticateAdmin();
  if (!authenticated) {
    return createUnauthorizedResponse(
      "Authentication required to update members"
    );
  }

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

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
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

    const result = await pool.query(
      `UPDATE public.members
       SET nom = $1, email = $2, role = $3, phone = $4
       WHERE id = $5 RETURNING *`,
      [nom, email, role, phone, id]
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

// PATCH — Update member display order (for drag & drop)
export async function PATCH(req: NextRequest) {
  try {
    const { memberOrders } = await req.json();

    if (!Array.isArray(memberOrders)) {
      return NextResponse.json(
        { error: "memberOrders must be an array" },
        { status: 400 }
      );
    }

    // Update display_order for each member
    const updatePromises = memberOrders.map(
      (order: { id: number; display_order: number }) =>
        pool.query(
          "UPDATE public.members SET display_order = $1 WHERE id = $2",
          [order.display_order, order.id]
        )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Member order updated successfully" });
  } catch (err) {
    console.error("❌ PATCH /api/members error:", err);
    return NextResponse.json(
      { error: "Failed to update member order" },
      { status: 500 }
    );
  }
}

// DELETE — Delete a member by ID
export async function DELETE(req: NextRequest) {
  // Authentication check
  const { authenticated } = await authenticateAdmin();
  if (!authenticated) {
    return createUnauthorizedResponse(
      "Authentication required to delete members"
    );
  }

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
      "DELETE FROM public.members WHERE id = $1 RETURNING *",
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
