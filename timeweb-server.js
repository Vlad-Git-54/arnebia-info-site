import http from "node:http";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicPort = Number.parseInt(process.env.PORT ?? "3000", 10);
const publicHost = process.env.HOST ?? "0.0.0.0";
const internalPort = Number.parseInt(process.env.APP_INTERNAL_PORT ?? "3001", 10);
const internalHost = "127.0.0.1";
const rootDir = dirname(fileURLToPath(import.meta.url));
let applicationReady = false;
let loggedRequests = 0;

function sendHealthOk(request, response) {
  response.shouldKeepAlive = false;
  response.writeHead(200, {
    "cache-control": "no-store",
    connection: "close",
    "content-length": "2",
    "content-type": "text/plain; charset=utf-8",
  });
  response.end(request.method === "HEAD" ? undefined : "ok");
}

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

function markApplicationReady() {
  if (!applicationReady) {
    applicationReady = true;
    console.log("[timeweb] application server is ready");
  }
}

const readinessCheck = setInterval(() => {
  const readinessRequest = http.request(
    {
      hostname: internalHost,
      method: "GET",
      path: "/health",
      port: internalPort,
      timeout: 2000,
    },
    (readinessResponse) => {
      if ((readinessResponse.statusCode ?? 500) < 500) {
        clearInterval(readinessCheck);
        markApplicationReady();
      }
      readinessResponse.resume();
    },
  );

  readinessRequest.on("error", () => {});
  readinessRequest.on("timeout", () => readinessRequest.destroy());
  readinessRequest.end();
}, 500);

const server = http.createServer((request, response) => {
  if (loggedRequests < 30) {
    loggedRequests += 1;
    console.log(
      `[timeweb] request ${request.method ?? "GET"} ${request.url ?? "/"} host=${
        request.headers.host ?? "-"
      } ua=${request.headers["user-agent"] ?? "-"}`,
    );
  }

  if (
    request.method === "HEAD" ||
    request.url === "/health" ||
    request.url === "/health/" ||
    (!applicationReady && (request.url === "/" || request.url === ""))
  ) {
    sendHealthOk(request, response);
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
      if ((upstreamResponse.statusCode ?? 500) < 500) {
        markApplicationReady();
      }
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
