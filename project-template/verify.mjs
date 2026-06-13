// Project verifier. Place this at <repo>/.claude/verify.mjs
// Adapt the commands to your stack. Exit 0 = green, non-zero = red.
// The model runs this to PROVE a change works before claiming "done".
import { spawnSync } from "node:child_process";

function run(label, cmd, args) {
  process.stdout.write(`\n=== ${label} ===\n`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  return r.status === 0;
}

const ok =
  run("lint",  "npm", ["run", "lint", "--if-present"]) &&
  run("test",  "npm", ["test", "--if-present"]) &&
  run("build", "npm", ["run", "build", "--if-present"]);

console.log(`\nVERIFY_RESULT=${ok ? "pass" : "fail"}`);
process.exit(ok ? 0 : 1);
