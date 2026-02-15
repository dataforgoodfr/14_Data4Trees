/**
 * Script de vérification de l'architecture FSD
 * Vérifie que les imports respectent les règles de l'architecture
 */

const fs = require("fs");
const path = require("path");

// =============== DEFINE LAYERS ===============

const LAYERS_DICT = {
  app: "app",
  pages: "pages",
  widgets: "widgets",
  features: "features",
  entities: "entities",
  shared: "shared",
};

const SHARED_FOLDERS = ["libs", "i18n", "ui", "hooks"].flatMap((folder) => [
  `${LAYERS_DICT.shared}/${folder}`,
  folder,
]);

const LAYERS = Object.keys(LAYERS_DICT);

const SHARED_DEPENDENCIES = [...SHARED_FOLDERS, LAYERS_DICT.shared];
const ENTITIES_DEPENDENCIES = [...SHARED_DEPENDENCIES, LAYERS_DICT.entities];
const FEATURES_DEPENDENCIES = [...ENTITIES_DEPENDENCIES, LAYERS_DICT.features];
const WIDGETS_DEPENDENCIES = [...FEATURES_DEPENDENCIES, LAYERS_DICT.widgets];
const PAGES_DEPENDENCIES = [...WIDGETS_DEPENDENCIES, LAYERS_DICT.pages];
const APP_DEPENDENCIES = [...PAGES_DEPENDENCIES, LAYERS_DICT.app];

const LAYER_HIERARCHY = {
  shared: SHARED_DEPENDENCIES,
  entities: ENTITIES_DEPENDENCIES,
  features: FEATURES_DEPENDENCIES,
  widgets: WIDGETS_DEPENDENCIES,
  pages: PAGES_DEPENDENCIES,
  app: APP_DEPENDENCIES,
};

// =============== DEFINE CONSTANTS ===============

const SRC_DIR = path.join(__dirname, "../src");

function getLayerFromPath(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  const firstDir = relativePath.split(path.sep)[0];
  return LAYERS.includes(firstDir) ? firstDir : null;
}

function checkImports(filePath, fileContent) {
  const layer = getLayerFromPath(filePath);
  console.log("Layer is ", layer, " for ", filePath);
  if (!layer) return [];

  const violations = [];
  const importRegex =
    /import\s+.*\s+from\s+['"](@(?:app|pages|widgets|features|entities|shared|i18n|libs|hooks|ui)(?:\/.*)?)['"]/g;
  let match;

  while ((match = importRegex.exec(fileContent)) !== null) {
    const importPath = match[1]; // @app/providers/...;
    const importedLayer = importPath.split("/")[0].replace("@", ""); // app
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
console.log("🔍 Vérification de l'architecture custom FSD...\n");

const violations = scanDirectory(SRC_DIR);

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
