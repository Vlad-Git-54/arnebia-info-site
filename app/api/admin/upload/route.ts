import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  isAdminRequest,
  uploadsDir,
} from "@/lib/admin-config";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function safeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54) || "banner";
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, message: "Требуется вход в админку." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ ok: false, message: "Файл не найден." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    return Response.json(
      { ok: false, message: "Поддерживаются JPG, PNG, WEBP и GIF." },
      { status: 400 },
    );
  }

  if (file.size > 8 * 1024 * 1024) {
    return Response.json(
      { ok: false, message: "Файл должен быть меньше 8 МБ." },
      { status: 400 },
    );
  }

  await mkdir(uploadsDir(), { recursive: true });

  const filename = `${Date.now()}-${safeName(file.name)}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const destination = path.join(uploadsDir(), filename);

  await writeFile(destination, bytes);

  return Response.json({
    ok: true,
    url: `/admin-assets/${filename}`,
  });
}

