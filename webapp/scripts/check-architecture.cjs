/**
 * Script de vérification de l'architecture FSD
 * Vérifie que les imports respectent les règles de l'architecture
 */

const fs = require("fs");
const path = require("path");

const LAYERS = ["app", "pages", "widgets", "features", "entities", "shared"];
const LAYER_HIERARCHY = {
  shared: [],
  entities: ["shared"],
  features: ["entities", "shared"],
  widgets: ["features", "entities", "shared"],
  pages: ["widgets", "features", "entities", "shared"],
  app: ["pages", "widgets", "features", "entities", "shared"],
};

function getLayerFromPath(filePath) {
  const relativePath = path.relative(path.join(__dirname, "src"), filePath);
  const firstDir = relativePath.split(path.sep)[0];
  return LAYERS.includes(firstDir) ? firstDir : null;
}

function checkImports(filePath, fileContent) {
  const layer = getLayerFromPath(filePath);
  if (!layer) return [];

  const violations = [];
  const importRegex = /import\s+.*\s+from\s+['"]@\/([^/'"]+)/g;
  let match;

  while ((match = importRegex.exec(fileContent)) !== null) {
    const importedLayer = match[1];

    if (
      LAYERS.includes(importedLayer) &&
      !LAYER_HIERARCHY[layer].includes(importedLayer)
    ) {
      violations.push({
        file: filePath,
        layer,
        importedLayer,
        line: fileContent.substring(0, match.index).split("\n").length,
      });
    }
  }

  return violations;
}

function scanDirectory(dir) {
  const violations = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      violations.push(...scanDirectory(filePath));
    } else if (
      stat.isFile() &&
      (file.endsWith(".ts") || file.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8");
      violations.push(...checkImports(filePath, content));
    }
  }

  return violations;
}

// Exécution
console.log("🔍 Vérification de l'architecture FSD...\n");

const srcDir = path.join(__dirname, "../src");
const violations = scanDirectory(srcDir);

if (violations.length === 0) {
  console.log(
    "✅ Aucune violation détectée ! L'architecture FSD est respectée.",
  );
} else {
  console.log(`❌ ${violations.length} violation(s) détectée(s):\n`);

  violations.forEach(({ file, layer, importedLayer, line }) => {
    const relativeFile = path.relative(__dirname, file);
    console.log(`  ${relativeFile}:${line}`);
    console.log(
      `    ↳ La couche "${layer}" ne peut pas importer depuis "${importedLayer}"`,
    );
    console.log(
      `    ↳ Imports autorisés: ${LAYER_HIERARCHY[layer].join(", ") || "aucun"}\n`,
    );
  });

  process.exit(1);
}
