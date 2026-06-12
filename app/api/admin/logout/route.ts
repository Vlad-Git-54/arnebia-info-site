import { clearAdminSessionCookie } from "@/lib/admin-config";

export const runtime = "nodejs";

export function POST() {
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearAdminSessionCookie(),
      },
    },
  );
}

