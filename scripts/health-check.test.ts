import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CHECK_STEPS,
  TWIN_PING_BODY,
  TWIN_PING_URL,
  pingTwin,
  runCommand,
  runHealthCheck,
} from "./health-check.mjs";

function createChild(code: number, error?: Error) {
  const child = new EventEmitter();
  queueMicrotask(() => {
    if (error) {
      child.emit("error", error);
      return;
    }
    child.emit("close", code);
  });
  return child;
}

describe("health-check", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defines TypeScript, unit test, and Next.js build steps", () => {
    expect(CHECK_STEPS).toEqual([
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
    ]);
    expect(TWIN_PING_URL).toBe("http://localhost:3000/api/twin");
    expect(TWIN_PING_BODY).toEqual({
      messages: [{ role: "user", content: "hey" }],
    });
  });

  it("wires npm run check to the health-check script", () => {
    const pkg = JSON.parse(
      readFileSync(path.resolve(process.cwd(), "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(pkg.scripts.check).toBe("node scripts/health-check.mjs");
  });

  it("sends a valid twin transcript and requires HTTP 200", async () => {
    const body = { cancel: vi.fn().mockResolvedValue(undefined) };
    const fetchMock = vi.fn().mockResolvedValue({ status: 200, body });

    await expect(pingTwin(TWIN_PING_URL, fetchMock)).resolves.toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(TWIN_PING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "hey" }],
      }),
    });
    expect(body.cancel).toHaveBeenCalled();
  });

  it("fails the ping when the twin route rejects the payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 400 });

    await expect(pingTwin(TWIN_PING_URL, fetchMock)).rejects.toThrow(
      "Twin ping failed: http://localhost:3000/api/twin returned 400",
    );
  });

  it("fails the ping when the twin route is unreachable", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("fetch failed"));

    await expect(pingTwin(TWIN_PING_URL, fetchMock)).rejects.toThrow(
      "Twin ping failed: http://localhost:3000/api/twin is unreachable (fetch failed)",
    );
  });

  it("resolves runCommand when the process exits 0", async () => {
    const spawnMock = vi.fn().mockReturnValue(createChild(0));

    await expect(
      runCommand("npx", ["tsc", "--noEmit"], { spawn: spawnMock }),
    ).resolves.toBe(0);
    expect(spawnMock).toHaveBeenCalledWith(
      "npx",
      ["tsc", "--noEmit"],
      expect.objectContaining({ stdio: "inherit" }),
    );
  });

  it("rejects runCommand when the process exits non-zero", async () => {
    const spawnMock = vi.fn().mockReturnValue(createChild(2));

    await expect(
      runCommand("npx", ["tsc", "--noEmit"], { spawn: spawnMock }),
    ).rejects.toThrow("npx tsc --noEmit failed with exit code 2");
  });

  it("runs TypeScript, tests, build, then the twin ping in order", async () => {
    const calls: string[] = [];
    const runMock = vi.fn(async (command: string, args: string[]) => {
      calls.push(`${command} ${args.join(" ")}`);
    });
    const pingMock = vi.fn(async () => {
      calls.push("ping");
      return 200;
    });
    const log = vi.fn();

    await expect(
      runHealthCheck({
        runCommand: runMock,
        pingTwin: pingMock,
        log,
      }),
    ).resolves.toBe(200);

    expect(calls).toEqual([
      "npx tsc --noEmit",
      "npm test -- --run",
      "npm run build",
      "ping",
    ]);
    expect(log).toHaveBeenCalledWith("✓ Twin ping (200)");
  });

  it("stops before later steps when a command fails", async () => {
    const runMock = vi.fn(async (command: string) => {
      if (command === "npm") {
        throw new Error("npm test -- --run failed with exit code 1");
      }
    });
    const pingMock = vi.fn();

    await expect(
      runHealthCheck({
        runCommand: runMock,
        pingTwin: pingMock,
        log: vi.fn(),
      }),
    ).rejects.toThrow("npm test -- --run failed with exit code 1");
    expect(runMock).toHaveBeenCalledTimes(2);
    expect(pingMock).not.toHaveBeenCalled();
  });
});
