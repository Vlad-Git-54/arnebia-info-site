import {
  isAdminRequest,
  readAdminContent,
  writeAdminContent,
} from "@/lib/admin-config";

export const runtime = "nodejs";

function unauthorized() {
  return Response.json({ ok: false, message: "Требуется вход в админку." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  return Response.json(await readAdminContent());
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = await request.json();

    return Response.json(await writeAdminContent(body));
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Не удалось сохранить настройки.",
      },
      { status: 400 },
    );
  }
}

