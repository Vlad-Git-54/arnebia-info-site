import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/admin-config";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const safeFile = path.basename(file);
  const extension = path.extname(safeFile).toLowerCase();
  const contentType = contentTypes[extension];

  if (!contentType || safeFile !== file) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const bytes = await readFile(path.join(uploadsDir(), safeFile));

    return new Response(bytes, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

