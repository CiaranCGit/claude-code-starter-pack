#!/usr/bin/env node
'use strict';
// SessionStart hook: surfaces a repo's accumulated lessons into context so past
// corrections are present this session. Reads tasks/lessons.md from the cwd.
// Harmless no-op in repos that don't have the file.
const fs = require('fs');
try {
  const t = fs.readFileSync('tasks/lessons.md', 'utf8');
  if (t.trim()) console.log('Project lessons (tasks/lessons.md):\n' + t);
} catch {}
