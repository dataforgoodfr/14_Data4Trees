/**
 * @file Script de génération d'arborescence de dossiers.
 * Affiche une représentation visuelle et/ou l'enregistre dans un fichier.
 *
 * @usage node scripts/generate-tree.cjs <chemin_du_dossier> [fichier_de_sortie]
 * @example node scripts/generate-tree.cjs ./frontend/src docs/frontend-archi.md
 */

const fs = require('fs');
const path = require('path');

const IGNORE_LIST = [
    'node_modules',
    '.git',
    'dist',
    'coverage',
    '.vscode',
];

// Caractères Unicode (maintenant commentés)
// const PREFIX_BRANCH = '├── ';
// const PREFIX_LAST_BRANCH = '└── ';
// const PREFIX_CHILD = '│   ';
// const PREFIX_EMPTY = '    ';

// Alternative avec des caractères ASCII-safe pour une compatibilité maximale
const PREFIX_BRANCH = '|-- ';
const PREFIX_LAST_BRANCH = '`-- '; // Utilise un accent grave pour simuler la branche finale
const PREFIX_CHILD = '|   ';
const PREFIX_EMPTY = '    ';


/**
 * Fonction récursive qui génère l'arborescence d'un dossier.
 * @param {string} directory - Le chemin du dossier à analyser.
 * @param {string} prefix - Le préfixe de ligne pour l'indentation.
 * @returns {string[]} Un tableau de chaînes, chaque chaîne étant une ligne de l'arbre.
 */
function generateTree(directory, prefix = '') {
    const lines = [];
    const files = fs.readdirSync(directory)
        .filter(file => !IGNORE_LIST.includes(file));

    files.forEach((file, index) => {
        const filePath = path.join(directory, file);
        const isLast = index === files.length - 1;
        const isDirectory = fs.statSync(filePath).isDirectory();

        lines.push(prefix + (isLast ? PREFIX_LAST_BRANCH : PREFIX_BRANCH) + file);

        if (isDirectory) {
            const childPrefix = prefix + (isLast ? PREFIX_EMPTY : PREFIX_CHILD);
            lines.push(...generateTree(filePath, childPrefix));
        }
    });
    return lines;
}

// --- Point d'entrée du script ---

const targetDir = process.argv[2];
const outputFile = process.argv[3];

if (!targetDir) {
    console.error('❌ Erreur : Veuillez spécifier le chemin du dossier à analyser.');
    console.error('Usage: node scripts/generate-tree.cjs <chemin_dossier> [fichier_sortie]');
    process.exit(1);
}

if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    console.error(`❌ Erreur : Le dossier "${targetDir}" n'est pas un dossier valide.`);
    process.exit(1);
}

const treeLines = [
    `\`\`\`text`,
    path.basename(targetDir),
    ...generateTree(targetDir),
    `\`\`\``
];

const outputString = treeLines.join('\n');

console.log('🌳 Arborescence générée :\n');
console.log(outputString);

if (outputFile) {
    try {
        // Le BOM n'est plus nécessaire avec des caractères ASCII purs.
        fs.writeFileSync(outputFile, outputString, 'utf8');
        console.log(`\n✅ Arborescence sauvegardée avec succès dans : ${outputFile}`);
    } catch (error) {
        console.error(`\n❌ Erreur lors de l'écriture du fichier : ${error.message}`);
        process.exit(1);
    }
}