import http from "node:http";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicPort = Number.parseInt(process.env.PORT ?? "3000", 10);
const publicHost = process.env.HOST ?? "0.0.0.0";
const internalPort = Number.parseInt(process.env.APP_INTERNAL_PORT ?? "3001", 10);
const internalHost = "127.0.0.1";
const rootDir = dirname(fileURLToPath(import.meta.url));
let loggedRequests = 0;

const child = spawn(process.execPath, [join(rootDir, "server.js")], {
  cwd: rootDir,
  env: {
    ...process.env,
    HOST: internalHost,
    PORT: String(internalPort),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  console.error(
    `[timeweb] application server exited with code ${code ?? "null"} signal ${
      signal ?? "null"
    }`,
  );
  process.exit(code ?? 1);
});

const server = http.createServer((request, response) => {
  if (loggedRequests < 30) {
    loggedRequests += 1;
    console.log(
      `[timeweb] request ${request.method ?? "GET"} ${request.url ?? "/"} host=${
        request.headers.host ?? "-"
      } ua=${request.headers["user-agent"] ?? "-"}`,
    );
  }

  if (request.url === "/health" || request.url === "/health/") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("ok");
    return;
  }

  if (request.method === "HEAD") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end();
    return;
  }

  const upstream = http.request(
    {
      headers: request.headers,
      hostname: internalHost,
      method: request.method,
      path: request.url,
      port: internalPort,
    },
    (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    },
  );

  upstream.on("error", (error) => {
    console.error("[timeweb] upstream request failed", error);
    response.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    response.end("application is starting");
  });

  request.pipe(upstream);
});

server.listen(publicPort, publicHost, () => {
  console.log(`[timeweb] health proxy listening at http://${publicHost}:${publicPort}`);
  console.log(`[timeweb] application proxy target http://${internalHost}:${internalPort}`);
});
