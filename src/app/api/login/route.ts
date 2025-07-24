import { NextResponse } from "next/server";
import { Client } from "pg";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    const query = `
      SELECT ac.id, ac.password, ac.nom, ac.prenom, ar.role_name
      FROM admin_credits ac
      JOIN admin_roles ar ON ac.role_id = ar.id
      WHERE ac.email = $1 OR ac.nom = $1
    `;
    const result = await client.query(query, [username]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionData = {
      id: admin.id,
      name: admin.nom,
      role: admin.role_name,
    };

    const cookieStore = await cookies();
    cookieStore.set("nexus_administrateur", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 4, 
    });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}
