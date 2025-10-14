// build.ts
import { spawn } from "bun";
import { platform } from "process";
import { argv } from "node:process";

import { builds } from "./custom.ts";
import { BuildArchitectures, Cmd } from "../../../src/types/package-config.ts";
import {
  BOLD,
  DARK_GREEN,
  GREEN,
  MAGENTA,
  RESET,
} from "../../../src/types/theme.ts";
import { join } from "node:path";

let CWD: string;

export function toSpawnCmd(cmd: Cmd): string[] {
  if (Array.isArray(cmd)) return cmd; // no shell
  // use a shell so quotes/&&/env vars work
  return platform === "win32"
    ? ["cmd.exe", "/d", "/s", "/c", cmd]
    : ["bash", "-lc", cmd];
}

export async function run(
  cmd: Cmd,
  label?: string,
  opts: { cwd?: string } = {}
) {
  if (label) console.log(`${BOLD}${DARK_GREEN} ${label}${RESET}`);
  const p = spawn({
    cmd: toSpawnCmd(cmd),
    cwd: opts.cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  if ((await p.exited) !== 0) throw new Error(`failed: ${label ?? ""}`);
}

// explicit order, fully typed:
const buildOrder: (keyof BuildArchitectures)[] = [
  "windows_x86_64",
  "windows_aarch64",
];

export async function build(builds: BuildArchitectures) {
  const flatten = (c: Cmd) =>
    typeof c === "string" ? c.replace(/\s+/g, " ").trim() : c;

  for (const name of buildOrder) {
    const cfg = builds[name];
    console.log(`\n${BOLD}${GREEN}=== ${name} ===${RESET}`);
    await run(flatten(cfg.configStep), `Configuring (${name})`, {
      cwd: CWD,
    });
    await run(cfg.buildStep, `Building (${name})`, { cwd: CWD });
    await run(cfg.installStep, `Installing (${name})`, { cwd: CWD });
    console.log(`✅ Done: ${name}`);
  }
  console.log("\n🎉 All builds complete.");
}

export async function main(action: string, cwd: string = process.cwd()) {
  CWD = cwd;
  if (action == "build") await build(builds(cwd));
  if (action == "clean") {
    const buildDir = join(cwd, "build");
    await run(`rm -rf ${buildDir}`);
  }
  if (action == "help") {
    console.log(
      `${BOLD}${MAGENTA}build:${RESET} builds the project for all supported architectures \n${BOLD}${MAGENTA}clean:${RESET} deletes the build directory`
    );
  }
}

const args = argv.slice(2);
const [action = "help"] = args;

main(action);
