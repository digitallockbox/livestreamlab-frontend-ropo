const fs = require("fs");
const path = require("path");

const pages = [
  "src/pages/dashboard.tsx",
  "src/pages/help.tsx",
  "src/pages/support.tsx",
  "src/pages/analytics.tsx",
  "src/pages/streams.tsx",
  "src/pages/earnings.tsx",
  "src/pages/autosplit.tsx",
  "src/pages/content.tsx",
  "src/pages/affiliate.tsx",
  "src/pages/integrations.tsx",
  "src/pages/settings.tsx",
];

const requiredMarkers = [
  "useApiData",
  "if (isLoading)",
  "if (error || !data)",
  "Retry",
  "reload",
];

const pagesRequiringEmptyState = [
  "src/pages/dashboard.tsx",
  "src/pages/help.tsx",
  "src/pages/support.tsx",
];

const workspaceRoot = path.resolve(__dirname, "..");
const failures = [];

for (const relPath of pages) {
  const filePath = path.join(workspaceRoot, relPath);
  const source = fs.readFileSync(filePath, "utf8");

  for (const marker of requiredMarkers) {
    if (!source.includes(marker)) {
      failures.push(`${relPath} is missing marker: ${marker}`);
    }
  }

  if (pagesRequiringEmptyState.includes(relPath) && !source.includes("EmptyState")) {
    failures.push(`${relPath} is missing marker: EmptyState`);
  }
}

if (failures.length > 0) {
  console.error("UI smoke checks failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("UI smoke checks passed for loading/error/reload state contracts.");
