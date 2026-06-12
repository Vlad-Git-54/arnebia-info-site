import {
  createAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let password: unknown = "";

  try {
    const body = await request.json() as { password?: unknown };
    password = body.password;
  } catch {
    return Response.json({ ok: false, message: "Некорректный запрос." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return Response.json({ ok: false, message: "Неверный пароль." }, { status: 401 });
  }

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": createAdminSessionCookie(),
      },
    },
  );
}

