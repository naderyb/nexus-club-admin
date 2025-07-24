import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();

    const [eventsRes, projectsRes, membersRes] = await Promise.all([
      client.query("SELECT COUNT(*) FROM events"),
      client.query("SELECT COUNT(*) FROM projects"),
      client.query("SELECT COUNT(*) FROM members"),
    ]);

    const stats = {
      events: parseInt(eventsRes.rows[0].count, 10),
      projects: parseInt(projectsRes.rows[0].count, 10),
      members: parseInt(membersRes.rows[0].count, 10),
    };

    client.release();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("[DASHBOARD_COUNTS_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
