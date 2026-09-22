import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TWIN_PING_URL = "http://localhost:3000/api/twin";

export const TWIN_PING_BODY = {
  messages: [{ role: "user", content: "hey" }],
};

export const CHECK_STEPS = [
  {
    name: "TypeScript",
    command: "npx",
    args: ["tsc", "--noEmit"],
  },
  {
    name: "Unit tests",
    command: "npm",
    args: ["test", "--", "--run"],
  },
  {
    name: "Next.js build",
    command: "npm",
    args: ["run", "build"],
  },
];

export function runCommand(command, args, options = {}) {
  const spawnImpl = options.spawn ?? spawn;

  return new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: process.env,
      shell: process.platform === "win32",
      stdio: options.stdio ?? "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(code);
        return;
      }

      reject(
        new Error(`${command} ${args.join(" ")} failed with exit code ${code}`),
      );
    });
  });
}

export async function pingTwin(url = TWIN_PING_URL, fetchImpl = fetch) {
  let response;

  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TWIN_PING_BODY),
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Network error";
    throw new Error(`Twin ping failed: ${url} is unreachable (${message})`);
  }

  if (response?.status !== 200) {
    throw new Error(
      `Twin ping failed: ${url} returned ${response?.status ?? "no status"}`,
    );
  }

  if (response.body && typeof response.body.cancel === "function") {
    await response.body.cancel();
  }

  return response.status;
}

export async function runHealthCheck(options = {}) {
  const run = options.runCommand ?? runCommand;
  const ping = options.pingTwin ?? pingTwin;
  const log = options.log ?? console.log;

  for (const step of CHECK_STEPS) {
    log(`→ ${step.name}`);
    await run(step.command, step.args, options);
    log(`✓ ${step.name}`);
  }

  log("→ Twin ping");
  const status = await ping(options.twinUrl ?? TWIN_PING_URL, options.fetch);
  log(`✓ Twin ping (${status})`);

  return status;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  runHealthCheck().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
