function healthResponse(method: string) {
  console.log(`[arnebia-health] ${method} /health -> 200`);

  return new Response("ok", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
    status: 200,
  });
}

export function GET() {
  return healthResponse("GET");
}

export function HEAD() {
  return healthResponse("HEAD");
}
