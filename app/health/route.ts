function healthResponse() {
  return new Response("ok", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
    status: 200,
  });
}

export function GET() {
  return healthResponse();
}

export function HEAD() {
  return healthResponse();
}
