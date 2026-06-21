const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");

const read = (relPath) => fs.readFileSync(path.join(workspaceRoot, relPath), "utf8");

const hookSource = read("src/hooks/useOverlayRuntime.ts");
const streamsSource = read("src/pages/streams.tsx");
const previewSource = read("src/pages/overlay-preview.tsx");

const failures = [];

const editorStates = [
  "loading",
  "error",
  "empty",
  "preview-fallback",
  "theme-save-failure",
  "token-expired",
  "token-revoked",
];

const runtimeStates = [
  "loading",
  "connecting",
  "connected",
  "disconnected",
  "invalid-token",
  "no-events",
  "event-burst",
];

if (hookSource.includes("setInterval(")) {
  failures.push("Overlay runtime must not use polling via setInterval.");
}

const runtimeMarkers = [
  "new WebSocket(",
  "/ws/overlay/",
  "overlay.runtime.connected",
  "overlay.runtime.event.rendered",
  "mode: 'preview'",
  "window.addEventListener('message'",
];

for (const marker of runtimeMarkers) {
  if (!hookSource.includes(marker)) {
    failures.push(`useOverlayRuntime.ts missing marker: ${marker}`);
  }
}

const editorMarkers = [
  'src="/overlay-preview?creatorId=creator_default"',
  'postMessage(',
  'source: "overlay-editor"',
  'type: "event.mock"',
  'type: "token.revoked"',
];

for (const marker of editorMarkers) {
  if (!streamsSource.includes(marker)) {
    failures.push(`streams.tsx missing marker: ${marker}`);
  }
}

const previewMarkers = [
  "mode: \"preview\"",
  "No preview events yet.",
  "Runtime:",
];

for (const marker of previewMarkers) {
  if (!previewSource.includes(marker)) {
    failures.push(`overlay-preview.tsx missing marker: ${marker}`);
  }
}

for (const state of runtimeStates) {
  const stateMarker = `'${state}'`;
  if (!hookSource.includes(stateMarker)) {
    failures.push(`Runtime state contract missing: ${state}`);
  }
}

for (const state of editorStates) {
  if (!streamsSource.includes(state)) {
    failures.push(`Editor state marker missing: ${state}`);
  }
}

if (failures.length > 0) {
  console.error("Overlay smoke checks failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Overlay smoke checks passed for editor/runtime integration contracts.");
