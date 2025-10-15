#!/usr/bin/env node

/**
 * Script de Génération Automatique de Documentation
 *
 * Ce script génère automatiquement la documentation complète du projet
 * de migration Angular 5 → 20 en utilisant le DocumentationGenerator.
 *
 * Fonctionnalités :
 * - Génération de documentation HTML interactive
 * - Documentation Markdown pour GitHub/GitLab
 * - Documentation JSON structurée
 * - Diagrammes d'architecture Mermaid
 * - Documentation par phase de migration
 * - Statistiques et métriques du projet
 * - Recommandations d'amélioration
 *
 * Usage:
 *   node scripts/generate-docs.js
 *   node scripts/generate-docs.js --formats=html,markdown
 *   node scripts/generate-docs.js --include-phases --include-diagrams
 *
 * @author Migration Angular Team
 * @version 1.0.0
 * @since 2024-01-01
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Configuration par défaut du générateur de documentation
 */
const DEFAULT_CONFIG = {
  projectPath: process.cwd(),
  outputPath: './docs/generated',
  formats: ['html', 'markdown', 'json'],
  includePhases: true,
  includeDiagrams: true,
  detailLevel: 'comprehensive',
  verbose: true
};

/**
 * Fonction principale de génération de documentation
 */
async function generateDocumentation() {
  console.log('🚀 Démarrage de la génération automatique de documentation');
  console.log('=' .repeat(60));

  try {
    // Vérifier que nous sommes dans le bon répertoire
    if (!fs.existsSync('./package.json')) {
      throw new Error('❌ Ce script doit être exécuté depuis la racine du projet');
    }

    // Lire la configuration du projet
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    console.log(`📦 Projet: ${packageJson.name} v${packageJson.version}`);
    console.log(`📝 Description: ${packageJson.description}`);

    // Construire le projet si nécessaire
    console.log('\n🔨 Construction du projet...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Projet construit avec succès');
    } catch (error) {
      console.log('⚠️ Construction échouée, tentative de génération quand même...');
    }

    // Générer la documentation
    console.log('\n📚 Génération de la documentation...');
    const command = buildDocumentationCommand();
    console.log(`🔧 Commande: ${command}`);

    execSync(command, { stdio: 'inherit' });

    // Afficher les résultats
    console.log('\n✅ Documentation générée avec succès !');
    displayResults();

    // Générer des rapports supplémentaires
    await generateAdditionalReports();

    console.log('\n🎉 Génération de documentation terminée !');
    console.log('📄 Consultez le dossier ./docs/generated/ pour voir les résultats');

  } catch (error) {
    console.error('❌ Erreur lors de la génération de documentation:', error.message);
    process.exit(1);
  }
}

/**
 * Construit la commande de génération de documentation
 *
 * @returns {string} Commande à exécuter
 */
function buildDocumentationCommand() {
  const args = [
    'node tools/doc-generator/index.js',
    `--project-path="${DEFAULT_CONFIG.projectPath}"`,
    `--output-path="${DEFAULT_CONFIG.outputPath}"`,
    `--formats=${DEFAULT_CONFIG.formats.join(',')}`,
    `--detail-level=${DEFAULT_CONFIG.detailLevel}`
  ];

  if (DEFAULT_CONFIG.includePhases) {
    args.push('--include-phases');
  }

  if (DEFAULT_CONFIG.includeDiagrams) {
    args.push('--include-diagrams');
  }

  if (DEFAULT_CONFIG.verbose) {
    args.push('--verbose');
  }

  return args.join(' ');
}

/**
 * Affiche les résultats de la génération
 */
function displayResults() {
  const outputPath = DEFAULT_CONFIG.outputPath;

  if (!fs.existsSync(outputPath)) {
    console.log('⚠️ Dossier de sortie non trouvé');
    return;
  }

  console.log('\n📄 Fichiers générés:');
  const files = fs.readdirSync(outputPath);
  files.forEach(file => {
    const filePath = path.join(outputPath, file);
    const stats = fs.statSync(filePath);
    const size = formatFileSize(stats.size);
    const type = getFileType(file);
    console.log(`  ${type} ${file} (${size})`);
  });

  // Afficher les statistiques
  console.log('\n📊 Statistiques:');
  console.log(`  📁 Fichiers générés: ${files.length}`);
  console.log(`  📄 Formats: ${DEFAULT_CONFIG.formats.join(', ')}`);
  console.log(`  📋 Phases incluses: ${DEFAULT_CONFIG.includePhases ? 'Oui' : 'Non'}`);
  console.log(`  📊 Diagrammes inclus: ${DEFAULT_CONFIG.includeDiagrams ? 'Oui' : 'Non'}`);
}

/**
 * Génère des rapports supplémentaires
 */
async function generateAdditionalReports() {
  console.log('\n📈 Génération de rapports supplémentaires...');

  try {
    // Rapport de qualité du code
    await generateCodeQualityReport();

    // Rapport de couverture de tests
    await generateTestCoverageReport();

    // Rapport de performance
    await generatePerformanceReport();

  } catch (error) {
    console.log('⚠️ Erreur lors de la génération des rapports supplémentaires:', error.message);
  }
}

/**
 * Génère un rapport de qualité du code
 */
async function generateCodeQualityReport() {
  console.log('  🔍 Génération du rapport de qualité du code...');

  try {
    // Exécuter ESLint
    execSync('npm run lint', { stdio: 'pipe' });
    console.log('    ✅ ESLint: Aucune erreur détectée');
  } catch (error) {
    console.log('    ⚠️ ESLint: Erreurs détectées (voir logs)');
  }

  try {
    // Exécuter TypeScript compiler
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('    ✅ TypeScript: Aucune erreur de type');
  } catch (error) {
    console.log('    ⚠️ TypeScript: Erreurs de type détectées');
  }
}

/**
 * Génère un rapport de couverture de tests
 */
async function generateTestCoverageReport() {
  console.log('  🧪 Génération du rapport de couverture de tests...');

  try {
    execSync('npm run test:coverage', { stdio: 'pipe' });
    console.log('    ✅ Tests: Couverture générée');
  } catch (error) {
    console.log('    ⚠️ Tests: Erreurs lors de l\'exécution');
  }
}

/**
 * Génère un rapport de performance
 */
async function generatePerformanceReport() {
  console.log('  ⚡ Génération du rapport de performance...');

  try {
    // Mesurer le temps de build
    const startTime = Date.now();
    execSync('npm run build', { stdio: 'pipe' });
    const buildTime = Date.now() - startTime;

    console.log(`    ✅ Build: ${buildTime}ms`);

    // Analyser la taille du bundle
    if (fs.existsSync('./dist')) {
      const bundleSize = getDirectorySize('./dist');
      console.log(`    ✅ Bundle: ${formatFileSize(bundleSize)}`);
    }

  } catch (error) {
    console.log('    ⚠️ Performance: Erreurs lors de l\'analyse');
  }
}

/**
 * Formate la taille d'un fichier en unités lisibles
 *
 * @param {number} bytes - Taille en octets
 * @returns {string} Taille formatée
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Détermine le type d'un fichier pour l'affichage
 *
 * @param {string} filename - Nom du fichier
 * @returns {string} Emoji représentant le type
 */
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case '.html': return '🌐';
    case '.md': return '📝';
    case '.json': return '📋';
    case '.mermaid': return '📊';
    case '.png': case '.jpg': case '.jpeg': case '.gif': return '🖼️';
    case '.pdf': return '📄';
    default: return '📄';
  }
}

/**
 * Calcule la taille d'un répertoire
 *
 * @param {string} dirPath - Chemin du répertoire
 * @returns {number} Taille en octets
 */
function getDirectorySize(dirPath) {
  let totalSize = 0;

  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }

  calculateSize(dirPath);
  return totalSize;
}

/**
 * Parse les arguments de ligne de commande
 *
 * @returns {Object} Arguments parsés
 */
function parseArguments() {
  const args = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--formats' || arg === '-f') {
      args.formats = process.argv[++i].split(',');
    } else if (arg === '--no-phases') {
      args.includePhases = false;
    } else if (arg === '--no-diagrams') {
      args.includeDiagrams = false;
    } else if (arg === '--detail-level' || arg === '-d') {
      args.detailLevel = process.argv[++i];
    } else if (arg === '--quiet' || arg === '-q') {
      args.verbose = false;
    }
  }

  return args;
}

/**
 * Affiche l'aide du script
 */
function showHelp() {
  console.log(`
📚 Générateur Automatique de Documentation - Migration Angular 5 → 20

Ce script génère automatiquement une documentation complète et détaillée
pour le projet de migration Angular, incluant :
- Documentation API extraite des commentaires JSDoc
- Statistiques du projet et métriques de qualité
- Guides d'utilisation et exemples
- Diagrammes d'architecture
- Documentation par phase de migration
- Recommandations d'amélioration

Usage:
  node scripts/generate-docs.js [options]

Options:
  -f, --formats <formats>      Formats de sortie séparés par des virgules (défaut: html,markdown,json)
  --no-phases                  Exclure la documentation par phase
  --no-diagrams                Exclure les diagrammes d'architecture
  -d, --detail-level <level>   Niveau de détail: basic, detailed, comprehensive (défaut: comprehensive)
  -q, --quiet                  Mode silencieux (moins de logs)
  -h, --help                   Afficher cette aide

Exemples:
  # Génération complète (défaut)
  node scripts/generate-docs.js

  # Génération HTML uniquement
  node scripts/generate-docs.js --formats=html

  # Génération sans diagrammes
  node scripts/generate-docs.js --no-diagrams

  # Génération en mode silencieux
  node scripts/generate-docs.js --quiet

Fonctionnalités:
  ✅ Extraction automatique des commentaires JSDoc
  ✅ Analyse des métadonnées du projet
  ✅ Calcul des statistiques de code
  ✅ Génération de documentation API
  ✅ Création de diagrammes d'architecture
  ✅ Documentation par phase de migration
  ✅ Recommandations d'amélioration
  ✅ Rapports de qualité du code
  ✅ Rapports de couverture de tests
  ✅ Rapports de performance

Structure de sortie:
  docs/generated/
  ├── index.html              # Documentation HTML principale
  ├── README.md               # Documentation Markdown
  ├── documentation.json      # Documentation JSON structurée
  ├── architecture.mermaid    # Diagramme d'architecture
  ├── dependencies.mermaid    # Diagramme de dépendances
  ├── phase-1-angular-5-to-8.md    # Documentation Phase 1
  ├── phase-2-angular-8-to-12.md   # Documentation Phase 2
  ├── phase-3-angular-12-to-16.md  # Documentation Phase 3
  └── phase-4-angular-16-to-20.md  # Documentation Phase 4

Version: 1.0.0
Auteur: Migration Angular Team
Licence: MIT
`);
}

// Gestion des arguments
const args = parseArguments();

if (args.help) {
  showHelp();
  process.exit(0);
}

// Mise à jour de la configuration avec les arguments
if (args.formats) DEFAULT_CONFIG.formats = args.formats;
if (args.includePhases === false) DEFAULT_CONFIG.includePhases = false;
if (args.includeDiagrams === false) DEFAULT_CONFIG.includeDiagrams = false;
if (args.detailLevel) DEFAULT_CONFIG.detailLevel = args.detailLevel;
if (args.verbose === false) DEFAULT_CONFIG.verbose = false;

// Exécution du script
generateDocumentation().catch(error => {
  console.error('💥 Erreur critique:', error);
  process.exit(1);
});
