#!/usr/bin/env node

import { spawn } from 'node:child_process';

const intervalMinutes = Number(process.env.HIGHLIGHTS_INTERVAL_MINUTES ?? 60);
const args = process.argv.slice(2);

runOnce();
setInterval(runOnce, intervalMinutes * 60 * 1000);

function runOnce() {
  const child = spawn(process.execPath, ['scripts/highlight_raw.mjs', ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
  child.on('exit', (code) => {
    const now = new Date().toISOString();
    if (code === 0) {
      console.log(`[${now}] next highlight run in ${intervalMinutes} minutes`);
    } else {
      console.error(`[${now}] highlight run failed with exit code ${code}`);
    }
  });
}
