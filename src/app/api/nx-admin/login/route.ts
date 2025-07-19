import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;
  console.log("LOGIN route hit");
  console.log("Received body:", body);

  const match = username.match(/^([a-z]+)$/i); // now just one part for "nom"
  if (!match) {
    return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
  }

  const nom = match[1].toLowerCase(); // the username is now `nom`

  try {
    const query = `
      SELECT ac.*, ar.role_name FROM admin_credits ac
      JOIN admin_roles ar ON ac.role_id = ar.id
      WHERE LOWER(ac.nom) = $1
    `;
    const result = await client.query(query, [nom]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid username" }, { status: 401 });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    console.error("LOGIN route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}