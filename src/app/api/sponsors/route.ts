// app/api/sponsors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const createClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" 
      ? { rejectUnauthorized: false } 
      : false,
  });
};

// Helper function to handle database operations with proper error handling
async function withDatabase<T>(operation: (client: Client) => Promise<T>): Promise<T> {
  const client = createClient();
  
  try {
    await client.connect();
    return await operation(client);
  } finally {
    await client.end();
  }
}

// GET all sponsors
export async function GET() {
  console.log("📥 GET sponsors request");
  
  try {
    const sponsors = await withDatabase(async (client) => {
      const result = await client.query(
        "SELECT * FROM public.sponsors ORDER BY created_at DESC"
      );
      return result.rows;
    });

    console.log(`✅ Retrieved ${sponsors.length} sponsors`);
    return NextResponse.json(sponsors);
  } catch (err) {
    console.error("❌ Error fetching sponsors:", err);
    
    // Check if it's a table doesn't exist error
    if (err && typeof err === 'object' && 'code' in err && err.code === '42P01') {
      return NextResponse.json(
        { error: "Sponsors table does not exist. Please run the database setup script." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch sponsors" },
      { status: 500 }
    );
  }
}

// POST new sponsor
export async function POST(req: NextRequest) {
  console.log("📝 POST sponsor request");
  
  try {
    const body = await req.json();
    const {
      name,
      secteur_activite,
      phone,
      email,
      contact_person,
      contact_position,
      called = false,
      email_sent = false,
      comments = null,
    } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Clean and prepare data
    const cleanData = {
      name: name.trim(),
      secteur_activite: secteur_activite?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      contact_person: contact_person?.trim() || null,
      contact_position: contact_position?.trim() || null,
      called: Boolean(called),
      email_sent: Boolean(email_sent),
      comments: comments?.trim() || null,
    };

    const newSponsor = await withDatabase(async (client) => {
      const insertQuery = `
        INSERT INTO public.sponsors 
        (name, secteur_activite, phone, email, contact_person, contact_position, called, email_sent, comments, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        cleanData.name,
        cleanData.secteur_activite,
        cleanData.phone,
        cleanData.email,
        cleanData.contact_person,
        cleanData.contact_position,
        cleanData.called,
        cleanData.email_sent,
        cleanData.comments,
      ]);

      return result.rows[0];
    });

    console.log(`✅ Sponsor created with ID: ${newSponsor.id}`);
    return NextResponse.json(newSponsor, { status: 201 });
    
  } catch (err) {
    console.error("❌ Error adding sponsor:", err);

    // Handle specific PostgreSQL errors
    if (err && typeof err === 'object' && 'code' in err) {
      switch (err.code) {
        case '23505': // Unique violation
          return NextResponse.json(
            { error: "A sponsor with this email already exists" },
            { status: 409 }
          );
        case '42P01': // Table doesn't exist
          return NextResponse.json(
            { error: "Sponsors table does not exist. Please run the database setup script." },
            { status: 500 }
          );
        case '23502': // Not null violation
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
      }
    }

    // Handle JSON parsing errors
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add sponsor" },
      { status: 500 }
    );
  }
}

// DELETE sponsor by ID
export async function DELETE(req: NextRequest) {
  console.log("🗑️ DELETE sponsor request");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Sponsor ID is required" },
        { status: 400 }
      );
    }

    const sponsorId = parseInt(id);
    if (isNaN(sponsorId) || sponsorId <= 0) {
      return NextResponse.json(
        { error: "Invalid sponsor ID" },
        { status: 400 }
      );
    }

    const deletedSponsor = await withDatabase(async (client) => {
      // Check if sponsor exists
      const checkResult = await client.query(
        "SELECT id, name FROM public.sponsors WHERE id = $1",
        [sponsorId]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('SPONSOR_NOT_FOUND');
      }

      // Delete the sponsor
      await client.query("DELETE FROM public.sponsors WHERE id = $1", [sponsorId]);
      
      return checkResult.rows[0];
    });

    console.log(`✅ Sponsor ${deletedSponsor.name} (ID: ${sponsorId}) deleted successfully`);
    return NextResponse.json({
      message: "Sponsor deleted successfully",
      id: sponsorId,
      name: deletedSponsor.name
    });
    
  } catch (err) {
    console.error("❌ Error deleting sponsor:", err);
    
    if (err instanceof Error && err.message === 'SPONSOR_NOT_FOUND') {
      return NextResponse.json(
        { error: "Sponsor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete sponsor" },
      { status: 500 }
    );
  }
}

// PATCH sponsor by ID
export async function PATCH(req: NextRequest) {
  console.log("📝 PATCH sponsor request");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Sponsor ID is required" },
        { status: 400 }
      );
    }

    const sponsorId = parseInt(id);
    if (isNaN(sponsorId) || sponsorId <= 0) {
      return NextResponse.json(
        { error: "Invalid sponsor ID" },
        { status: 400 }
      );
    }

    const updates = await req.json();

    // Validate update fields
    const allowedFields = [
      'name', 'secteur_activite', 'phone', 'email', 
      'contact_person', 'contact_position', 'called', 
      'email_sent', 'comments'
    ];
    
    const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedSponsor = await withDatabase(async (client) => {
      // Check if sponsor exists
      const checkResult = await client.query(
        "SELECT id FROM public.sponsors WHERE id = $1",
        [sponsorId]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('SPONSOR_NOT_FOUND');
      }

      // Build dynamic update query
      const setClauses = [];
      const values = [];
      let paramIndex = 1;

      updateFields.forEach(field => {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      });

      setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(sponsorId);

      const updateQuery = `
        UPDATE public.sponsors 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);
      return result.rows[0];
    });

    console.log(`✅ Sponsor ${sponsorId} updated successfully`);
    return NextResponse.json(updatedSponsor);
    
  } catch (err) {
    console.error("❌ Error updating sponsor:", err);

    if (err instanceof Error && err.message === 'SPONSOR_NOT_FOUND') {
      return NextResponse.json(
        { error: "Sponsor not found" },
        { status: 404 }
      );
    }

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
  }
}

// PUT method (alias for PATCH for compatibility)
export async function PUT(req: NextRequest) {
  return PATCH(req);
}