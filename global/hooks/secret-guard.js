#!/usr/bin/env node
'use strict';

/*
 * PreToolUse guard. Reads the hook payload on stdin and blocks two things:
 *   1. git commands that skip hooks / signing (--no-verify, --no-gpg-sign, gpgsign=false)
 *   2. unambiguous credential signatures in Bash commands or Write/Edit content
 *
 * Pure Node (forward-slash path) so it runs under PowerShell or bash on any OS.
 * Fails OPEN on unexpected input — a malformed payload must never brick tool calls.
 */

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    process.exit(0); // fail open
  }

  const tool = input.tool_name || '';
  const ti = input.tool_input || {};

  // --- Guard 1: git hook/signing skips -------------------------------------
  if (tool === 'Bash') {
    const cmd = String(ti.command || '');
    if (/\bgit\b/.test(cmd)) {
      const skips = [
        [/--no-verify\b/, '--no-verify'],
        [/--no-gpg-sign\b/, '--no-gpg-sign'],
        [/commit\.gpgsign\s*=\s*false/, 'commit.gpgsign=false'],
      ];
      for (const [re, label] of skips) {
        if (re.test(cmd)) {
          return deny(
            `Blocked: this git command uses "${label}", which skips commit hooks/signing. ` +
            `Fix the underlying hook failure instead of bypassing it. ` +
            `If you genuinely need this, run it yourself or ask the user to allow it.`
          );
        }
      }
    }
  }

  // --- Guard 2: credential signatures --------------------------------------
  const fields = [];
  if (tool === 'Bash') fields.push(ti.command);
  else if (tool === 'Write') fields.push(ti.content, ti.file_path);
  else if (tool === 'Edit') fields.push(ti.new_string, ti.old_string);
  const text = fields.filter(Boolean).map(String).join('\n');

  const secrets = [
    [/sk-ant-[A-Za-z0-9_-]{16,}/, 'Anthropic API key'],
    [/\bghp_[A-Za-z0-9]{30,}/, 'GitHub personal access token'],
    [/\bgh[ousr]_[A-Za-z0-9]{30,}/, 'GitHub token'],
    [/\bgithub_pat_[A-Za-z0-9_]{50,}/, 'GitHub fine-grained PAT'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key ID'],
    [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
    [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
    [/-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/, 'private key block'],
    [/\bsk-[A-Za-z0-9]{32,}/, 'API secret key'],
  ];
  for (const [re, label] of secrets) {
    if (re.test(text)) {
      return deny(
        `Blocked: detected what looks like a ${label} in this ${tool} call. ` +
        `Refusing to avoid committing/leaking a live credential. ` +
        `If this is a false positive, run it yourself or allow it explicitly.`
      );
    }
  }

  process.exit(0); // allow
});

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}
