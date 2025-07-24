import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET: Fetch session info
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("nexus_administrateur");

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const adminData = JSON.parse(session.value);
    return NextResponse.json(adminData, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}

// DELETE: Remove session on logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("nexus_administrateur", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0), 
  });

  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
