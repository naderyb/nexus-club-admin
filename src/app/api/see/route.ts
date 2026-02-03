import { NextResponse } from "next/server";
import client from "@/lib/db";

export const dynamic = "force-dynamic";

type RegistrationStatus = "pending" | "confirmed" | "cancelled";

// GET – list all registrations for sortie en entreprise (SEE)
export async function GET() {
  try {
    const result = await client.query(
      `SELECT 
         id,
         full_name,
         email,
         phone,
         study_place,
         classe,
         motivation,
         extra,
         status,
         created_at
       FROM public.nexus_registrations
       ORDER BY created_at DESC`,
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/see error:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEE registrations" },
      { status: 500 },
    );
  }
}

// PATCH – update registration status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body as {
      id?: number;
      status?: RegistrationStatus;
    };

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 },
      );
    }

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const result = await client.query(
      `UPDATE public.nexus_registrations
       SET status = $1
       WHERE id = $2
       RETURNING id, full_name, email, phone, study_place, classe, motivation, extra, status, created_at`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("PATCH /api/see error:", error);
    return NextResponse.json(
      { error: "Failed to update registration status" },
      { status: 500 },
    );
  }
}
