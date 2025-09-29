import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

interface ManifestPair {
  sourceSegments: string[];
  targetSegments: string[];
  sourceRouteKey: string;
  targetRouteKey: string;
}

const manifestPairs: ManifestPair[] = [
  {
    sourceSegments: ["aichat"],
    targetSegments: ["(chat)"],
    sourceRouteKey: "/aichat/page",
    targetRouteKey: "/(chat)/page",
  },
  {
    sourceSegments: ["aichat", "chat", "[id]"],
    targetSegments: ["(chat)", "chat", "[id]"],
    sourceRouteKey: "/aichat/chat/[id]/page",
    targetRouteKey: "/(chat)/chat/[id]/page",
  },
];

const projectRoot = process.cwd();
const serverAppDir = path.join(projectRoot, ".next", "server", "app");

function ensureManifest({
  sourceSegments,
  targetSegments,
  sourceRouteKey,
  targetRouteKey,
}: ManifestPair) {
  const sourcePath = path.join(serverAppDir, ...sourceSegments, "page_client-reference-manifest.js");
  const targetDir = path.join(serverAppDir, ...targetSegments);
  const targetPath = path.join(targetDir, "page_client-reference-manifest.js");

  if (!existsSync(sourcePath)) {
    console.warn(`[fix-chat-manifests] Skipping ${targetRouteKey} because source manifest ${sourcePath} is missing.`);
    return;
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const sourceContent = readFileSync(sourcePath, "utf8");
  const updatedContent = sourceContent.replaceAll(`"${sourceRouteKey}"`, `"${targetRouteKey}"`);

  writeFileSync(targetPath, updatedContent, "utf8");
  console.log(`[fix-chat-manifests] Wrote manifest for ${targetRouteKey}`);
}

for (const pair of manifestPairs) {
  ensureManifest(pair);
}
