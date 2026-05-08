#!/usr/bin/env node
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ENV_PATH = path.resolve(__dirname, '../packages/native/.env');
const KEY = 'EXPO_PUBLIC_SERVER_URL';
const DEFAULT_PORT = 3000;

function detectIp() {
  if (process.platform !== 'darwin') {
    return null;
  }
  for (const iface of ['en0', 'en1']) {
    try {
      const out = execSync(`ipconfig getifaddr ${iface}`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      if (out) return out;
    } catch {
      // try next interface
    }
  }
  return null;
}

function readEnv() {
  return fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
}

function getCurrentPort(envText) {
  const line = envText.split('\n').find((l) => l.startsWith(`${KEY}=`));
  const match = line && line.match(/:(\d+)(?:\/|$)/);
  return match ? Number(match[1]) : DEFAULT_PORT;
}

function upsert(envText, nextValue) {
  const lines = envText.split('\n');
  const idx = lines.findIndex((l) => l.startsWith(`${KEY}=`));
  if (idx >= 0) {
    if (lines[idx] === `${KEY}=${nextValue}`) return null;
    lines[idx] = `${KEY}=${nextValue}`;
  } else {
    if (lines.length && lines[lines.length - 1] !== '') lines.push('');
    lines.push(`${KEY}=${nextValue}`);
  }
  return lines.join('\n');
}

function main() {
  const ip = detectIp();
  if (!ip) {
    console.warn(
      `[set-ip] Could not detect LAN IP (platform=${process.platform}). Skipping.`,
    );
    return;
  }
  const envText = readEnv();
  const port = getCurrentPort(envText);
  const url = `http://${ip}:${port}`;
  const next = upsert(envText, url);
  if (next === null) {
    console.log(`[set-ip] ${KEY} already set to ${url}, no change.`);
    return;
  }
  fs.mkdirSync(path.dirname(ENV_PATH), { recursive: true });
  fs.writeFileSync(ENV_PATH, next);
  console.log(
    `[set-ip] Wrote ${KEY}=${url} to ${path.relative(process.cwd(), ENV_PATH)}`,
  );
}

main();
