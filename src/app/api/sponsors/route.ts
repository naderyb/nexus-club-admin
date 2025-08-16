// app/api/sponsors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const createClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
};

// GET all sponsors
export async function GET() {
  console.log("hey fr0m GET");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = createClient();
  await client.connect();

  try {
    const result = await client.query(
      "SELECT * FROM sponsors ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    return NextResponse.json(
      { error: "Failed to fetch sponsors" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

// POST new sponsor
export async function POST(req: NextRequest) {
  console.log("hey fr0m POST");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const client = createClient();
  await client.connect();

  try {
    const {
      name,
      secteur_activite,
      phone,
      email,
      called = false,
      comments = null,
    } = await req.json();

    // Validate required fields
    if (!name || !secteur_activite || !phone || !email) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, secteur_activite, phone, email",
        },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO sponsors 
      (name, secteur_activite, phone, email, called, comments, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      name.trim(),
      secteur_activite.trim(),
      phone.trim(),
      email.trim(),
      called,
      comments,
    ]);

    console.log(`✅ Sponsor created with ID: ${result.rows[0].id}`);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding sponsor:", err);

    // Handle unique constraint violations (duplicate email)
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      return NextResponse.json(
        { error: "A sponsor with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add sponsor" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

// DELETE sponsor by ID - get ID from URL searchParams
export async function DELETE(req: NextRequest) {
  console.log("DELETE sponsor request");

  // Get ID from URL searchParams (?id=1)
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Sponsor ID is required" },
      { status: 400 }
    );
  }

  // Validate ID parameter
  const sponsorId = parseInt(id);
  if (isNaN(sponsorId) || sponsorId <= 0) {
    return NextResponse.json({ error: "Invalid sponsor ID" }, { status: 400 });
  }

  const client = createClient();

  try {
    await client.connect();

    // Check if sponsor exists before deletion
    const checkResult = await client.query(
      "SELECT id FROM sponsors WHERE id = $1",
      [sponsorId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    // Delete the sponsor
    await client.query("DELETE FROM sponsors WHERE id = $1", [sponsorId]);

    console.log(`✅ Sponsor ${sponsorId} deleted successfully`);
    return NextResponse.json({
      message: "Sponsor deleted successfully",
      id: sponsorId,
    });
  } catch (err) {
    console.error("❌ Error deleting sponsor:", err);
    return NextResponse.json(
      { error: "Failed to delete sponsor" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

// PATCH sponsor by ID - get ID from URL searchParams
export async function PATCH(req: NextRequest) {
  console.log("PATCH sponsor request");

  // Get ID from URL searchParams (?id=1)
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Sponsor ID is required" },
      { status: 400 }
    );
  }

  // Validate ID parameter
  const sponsorId = parseInt(id);
  if (isNaN(sponsorId) || sponsorId <= 0) {
    return NextResponse.json({ error: "Invalid sponsor ID" }, { status: 400 });
  }

  const client = createClient();

  try {
    await client.connect();

    const updates = await req.json();

    // Validate required fields
    if (typeof updates.called !== "boolean") {
      return NextResponse.json(
        { error: "Invalid 'called' field - must be boolean" },
        { status: 400 }
      );
    }

    // Check if sponsor exists
    const checkResult = await client.query(
      "SELECT id FROM sponsors WHERE id = $1",
      [sponsorId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    // Update sponsor with timestamp (removed called_by)
    const updateQuery = `
      UPDATE sponsors 
      SET 
        called = $1, 
        comments = $2, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING *
    `;

    const result = await client.query(updateQuery, [
      updates.called,
      updates.comments || null,
      sponsorId,
    ]);

    console.log(`✅ Sponsor ${sponsorId} updated successfully`);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating sponsor:", err);

    // Handle JSON parsing errors
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update sponsor" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

// PUT method (alias for PATCH for compatibility)
export async function PUT(req: NextRequest) {
  return PATCH(req);
}
