import { cookies } from "next/headers";

export async function authenticateAdmin() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("nexus_administrateur");

    if (!session) {
      return { authenticated: false, admin: null };
    }

    const adminData = JSON.parse(session.value);
    return { authenticated: true, admin: adminData };
  } catch {
    return { authenticated: false, admin: null };
  }
}

export function createUnauthorizedResponse(
  message = "Access denied. Admin authentication required."
) {
  return Response.json(
    {
      error: message,
      code: "UNAUTHORIZED",
    },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Cookie realm="admin"',
      },
    }
  );
}
