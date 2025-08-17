import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { authenticateAdmin, createUnauthorizedResponse } from "@/lib/auth";

export async function GET() {
  // Authenticate admin
  const authResult = await authenticateAdmin();
  if (!authResult.authenticated) {
    return createUnauthorizedResponse();
  }

  try {
    const [events, projects, members, sponsors] = await Promise.all([
      sql`SELECT COUNT(*) FROM public.events;`,
      sql`SELECT COUNT(*) FROM public.projects;`,
      sql`SELECT COUNT(*) FROM public.members;`,
      sql`SELECT COUNT(*) FROM public.sponsors;`,
    ]);

    return NextResponse.json({
      events: Number(events.rows[0].count),
      projects: Number(projects.rows[0].count),
      members: Number(members.rows[0].count),
      sponsors: Number(sponsors.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
