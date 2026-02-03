#!/usr/bin/env node
/**
 * Analizza un trace esportato da DevTools → Performance → Save profile.
 * Uso: node scripts/analyze-perf-trace.mjs <path-to-trace.json>
 *
 * Cerca:
 * - long task ricorrenti > 50ms
 * - frame time (intervalli tra CompositeLayers/Display)
 * - layout/recalc thrash (burst di Layout/Recalculate in finestre da 100ms)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const tracePath = process.argv[2];
if (!tracePath) {
  console.error("Uso: node scripts/analyze-perf-trace.mjs <path-to-trace.json>");
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(resolve(tracePath), "utf-8");
} catch {
  console.error("File non trovato:", tracePath);
  process.exit(1);
}

let trace;
try {
  trace = JSON.parse(raw);
} catch {
  console.error("JSON non valido");
  process.exit(1);
}

const events = Array.isArray(trace) ? trace : trace.traceEvents || [];
if (!events.length) {
  console.error("Nessun traceEvents nel file");
  process.exit(1);
}

const LONG_TASK_US = 50_000; // 50ms
const THRASH_WINDOW_MS = 100;
const THRASH_BURST_COUNT = 8;

// Long tasks (eventi completi con dur > 50ms)
const longTasks = events.filter(
  (e) => e.ph === "X" && e.dur != null && e.dur > LONG_TASK_US
);

// Nomi che indicano main-thread / script
const mainThreadNames = new Set([
  "RunTask",
  "FunctionCall",
  "EvaluateScript",
  "v8.compile",
  "TimerFire",
  "RequestAnimationFrame",
  "FireAnimationFrame",
]);
const longMainThread = longTasks.filter((e) =>
  mainThreadNames.has(e.name)
);

// Layout / Recalculate
const layoutEvents = events.filter(
  (e) =>
    e.ph === "X" &&
    e.name &&
    (e.name.includes("Layout") ||
      e.name.includes("Recalculate") ||
      e.name.includes("UpdateLayoutTree"))
);

// Finestre da 100ms: conta quanti layout in ogni finestra
const layoutTs = layoutEvents.map((e) => e.ts / 1000); // ms
let maxLayoutInWindow = 0;
if (layoutTs.length) {
  const sorted = [...layoutTs].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    const windowEnd = sorted[i] + THRASH_WINDOW_MS;
    const count = sorted.filter((t) => t >= sorted[i] && t <= windowEnd).length;
    if (count > maxLayoutInWindow) maxLayoutInWindow = count;
  }
}

// Frame boundaries (CompositeLayers / Display)
const frameEvents = events
  .filter(
    (e) =>
      e.ph === "X" &&
      e.name &&
      (e.name === "CompositeLayers" || e.name === "Display" || e.name === "RequestMainThreadFrame")
  )
  .map((e) => e.ts)
  .filter((t) => t > 0)
  .sort((a, b) => a - b);

const frameIntervalsUs = [];
for (let i = 1; i < frameEvents.length; i++) {
  frameIntervalsUs.push(frameEvents[i] - frameEvents[i - 1]);
}
const frameIntervalsMs = frameIntervalsUs.map((u) => u / 1000);
const avgFrameMs =
  frameIntervalsMs.length > 0
    ? frameIntervalsMs.reduce((a, b) => a + b, 0) / frameIntervalsMs.length
    : 0;
const variance =
  frameIntervalsMs.length > 1
    ? frameIntervalsMs.reduce((acc, x) => acc + (x - avgFrameMs) ** 2, 0) /
      (frameIntervalsMs.length - 1)
    : 0;
const stdevMs = Math.sqrt(variance);

// --- Report
console.log("\n--- Performance trace analysis ---\n");
console.log("Long tasks > 50ms (tutti):", longTasks.length);
console.log("Long tasks > 50ms (main-thread / script):", longMainThread.length);
if (longMainThread.length > 0) {
  const byName = {};
  longMainThread.forEach((e) => {
    byName[e.name] = (byName[e.name] || 0) + 1;
  });
  console.log("  Per nome:", byName);
  const recurring = Object.entries(byName).filter(([, n]) => n >= 2);
  if (recurring.length) {
    console.log("  [ATTENZIONE] Long task ricorrenti:", recurring);
  }
}

console.log("\nLayout/Recalc events:", layoutEvents.length);
console.log("Max layout in finestra 100ms:", maxLayoutInWindow);
if (maxLayoutInWindow >= THRASH_BURST_COUNT) {
  console.log("  [ATTENZIONE] Possibile layout thrash (burst >= 8 in 100ms)");
}

console.log("\nFrame boundaries (CompositeLayers/Display):", frameEvents.length);
if (frameIntervalsMs.length > 0) {
  console.log("Frame interval medio:", avgFrameMs.toFixed(2), "ms");
  console.log("Frame interval stdev:", stdevMs.toFixed(2), "ms");
  if (stdevMs > 10) {
    console.log("  [INFO] Frame time variabile (stdev > 10ms)");
  }
}

console.log("\n--- Criteri regression gate ---");
const okLong = longMainThread.length === 0 || longMainThread.length < 3;
const okThrash = maxLayoutInWindow < THRASH_BURST_COUNT;
console.log("Nessun long task ricorrente > 50ms:", okLong ? "OK" : "FAIL");
console.log("Resize/layout senza thrash:", okThrash ? "OK" : "FAIL");
console.log("Frame time (stdev):", stdevMs < 15 ? "OK" : "da verificare");
console.log("");
