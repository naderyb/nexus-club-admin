import { NextResponse } from "next/server";
import { Pool, PoolClient } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Add these configurations
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  allowExitOnIdle: true, // Allow the pool to close all connections and exit when idle
});

// Add error handling for the pool
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export interface newbies {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  hobbies?: string | null;
  motivation?: string | null;
  additional_notes?: string | null;
  email?: string | null;
  number?: string | null; // Phone number
  instagram?: string | null; // Add Instagram
  discord?: string | null; // Add Discord
  created_at: string;
  status: "pending" | "accepted" | "declined";
  updated_at?: string;
}

// GET → fetch all newbies
export async function GET() {
  console.log("🔥 GET request received at /api/newbies");

  try {
    const client = await pool.connect();

    const query = `
      SELECT 
        id,
        nom,
        prenom,
        classe,
        hobbies,
        motivation,
        additional_notes,
        email,
        num,
        instagram,
        discord,
        created_at,
        status,
        updated_at
      FROM newbies 
      ORDER BY created_at DESC
    `;

    const result = await client.query(query);
    client.release();

    console.log(`✅ Fetched ${result.rows.length} newbies`);
    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    console.error("❌ Error fetching newbies:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch newbies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST → insert a new newbies
export async function POST(req: Request) {
  console.log("POST request received at /api/newbies");

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const {
      nom,
      prenom,
      classe,
      hobbies,
      motivation,
      email,
      number,
      instagram,
      discord,
      additional_notes,
      anything,
      extra,
    } = body;

    if (!nom || !prenom) {
      console.log("❌ Validation failed: missing nom or prenom");
      return NextResponse.json(
        { success: false, error: "Nom et prénom obligatoires" },
        { status: 400 }
      );
    }

    // Handle multiple possible field names for notes
    const notes = additional_notes || anything || extra || null;

    const client = await pool.connect();

    const query = `
      INSERT INTO newbies (nom, prenom, classe, hobbies, motivation, email, number, instagram, discord, additional_notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
      RETURNING *;
    `;

    const values = [
      nom,
      prenom,
      classe || null,
      hobbies || null,
      motivation || null,
      email || null,
      number || null,
      instagram || null,
      discord || null,
      notes,
    ];

    console.log("Executing query with values:", values);
    const result = await client.query(query, values);
    client.release();

    console.log("Successfully inserted newbies:", result.rows[0]);
    return NextResponse.json(
      { success: true, newbies: result.rows[0] },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("❌ Error inserting newbies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH → update newbies status
export async function PATCH(req: Request) {
  console.log("PATCH request received at /api/newbies");

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "accepted", "declined"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    const query = `
      UPDATE newbies 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *
    `;

    const result = await client.query(query, [status, id]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "newbies not found" },
        { status: 404 }
      );
    }

    console.log("Successfully updated newbies status");
    return NextResponse.json({
      success: true,
      newbies: result.rows[0],
    });
  } catch (error: unknown) {
    console.error("❌ Error updating newbies status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to handle database operations with proper error handling
async function withDatabase<T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  let client;
  let retries = 3;

  while (retries > 0) {
    try {
      client = await pool.connect();
      return await operation(client);
    } catch (error) {
      if (client) client.release();
      retries--;
      if (retries === 0) throw error;
      console.log(`Database operation failed, ${retries} retries left`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Failed to connect after retries");
}

// DELETE → delete a newbies
export async function DELETE(req: Request) {
  console.log("🔥 DELETE request received at /api/newbies");

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const result = await withDatabase(async (client) => {
      const query = `DELETE FROM newbies WHERE id = $1 RETURNING *`;
      const queryResult = await client.query(query, [id]);
      client.release();
      return queryResult;
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "newbies not found" },
        { status: 404 }
      );
    }

    console.log("✅ Successfully deleted newbies");
    return NextResponse.json({
      success: true,
      message: "newbies deleted successfully",
    });
  } catch (error: unknown) {
    console.error("❌ Error deleting newbies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
