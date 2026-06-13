#!/usr/bin/env node
// Claude Code statusLine: prints "folder  model  ctx%" to the status bar.
// Receives JSON on stdin, writes one line to stdout.
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let d = {};
  try { d = JSON.parse(raw); } catch (_) {}
  const cwd = d.cwd || (d.workspace && d.workspace.current_dir) || "";
  const folder = cwd ? cwd.replace(/\\/g, "/").split("/").filter(Boolean).pop() : "?";
  const model = (d.model && d.model.display_name) || (d.model && d.model.id) || "?";
  let ctx = "ctx:--";
  const cw = d.context_window;
  if (cw && cw.used_percentage != null) {
    ctx = `ctx:${Math.round(cw.used_percentage)}%`;
  } else if (cw && cw.current_usage && cw.context_window_size) {
    ctx = `ctx:${Math.round((cw.current_usage.input_tokens || 0) / cw.context_window_size * 100)}%`;
  }
  process.stdout.write(`${folder}  ${model}  ${ctx}`);
});
