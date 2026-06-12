import {
  adminIsConfigured,
  isAdminRequest,
} from "@/lib/admin-config";

export const runtime = "nodejs";

export function GET(request: Request) {
  return Response.json({
    authenticated: isAdminRequest(request),
    configured: adminIsConfigured(),
  });
}

