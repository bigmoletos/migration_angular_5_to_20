#!/usr/bin/env node

/**
 * Point d'entrée du Générateur de Documentation Automatique
 *
 * Ce script génère automatiquement une documentation complète et détaillée
 * pour le projet de migration Angular 5 → 20.
 *
 * Usage:
 *   node tools/doc-generator/index.js --project-path=/path/to/project
 *   node tools/doc-generator/index.js --project-path=/path/to/project --formats=html,markdown
 *   node tools/doc-generator/index.js --project-path=/path/to/project --include-phases --include-diagrams
 *
 * @author Migration Angular Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { DocumentationGenerator } from './DocumentationGenerator';
import { Logger } from '../../shared/utils/Logger';

const logger = new Logger('DocGeneratorCLI');

/**
 * Fonction principale du générateur de documentation
 */
async function main(): Promise<void> {
  try {
    // Parse des arguments de ligne de commande
    const args = parseArguments();

    if (args.help) {
      showHelp();
      return;
    }

    // Validation des arguments
    if (!args.projectPath) {
      logger.error('❌ Le chemin du projet est requis');
      showHelp();
      process.exit(1);
    }

    // Configuration des options
    const options = {
      formats: args.formats || ['html', 'markdown', 'json'],
      includePhases: args.includePhases || false,
      includeDiagrams: args.includeDiagrams || false,
      detailLevel: args.detailLevel || 'detailed'
    };

    logger.info('🚀 Démarrage du générateur de documentation');
    logger.info(`📁 Projet: ${args.projectPath}`);
    logger.info(`📄 Formats: ${options.formats.join(', ')}`);
    logger.info(`📋 Phases: ${options.includePhases ? 'Incluses' : 'Exclues'}`);
    logger.info(`📊 Diagrammes: ${options.includeDiagrams ? 'Inclus' : 'Exclus'}`);
    logger.info(`🔍 Niveau de détail: ${options.detailLevel}`);

    // Génération de la documentation
    const generator = new DocumentationGenerator();
    const outputPath = await generator.generateDocumentation(
      args.projectPath,
      args.outputPath,
      options
    );

    // Affichage des résultats
    logger.info(`✅ Documentation générée avec succès dans: ${outputPath}`);

    // Affichage des fichiers générés
    const { readdir } = await import('fs/promises');
    const files = await readdir(outputPath);
    logger.info('📄 Fichiers générés:');
    files.forEach(file => logger.info(`  📄 ${file}`));

    process.exit(0);

  } catch (error) {
    logger.error('💥 Erreur critique dans le générateur de documentation', error);
    process.exit(1);
  }
}

/**
 * Parse les arguments de ligne de commande
 *
 * @returns Object contenant les arguments parsés
 */
function parseArguments(): any {
  const args: any = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--project-path' || arg === '-p') {
      args.projectPath = process.argv[++i];
    } else if (arg === '--output-path' || arg === '-o') {
      args.outputPath = process.argv[++i];
    } else if (arg === '--formats' || arg === '-f') {
      args.formats = process.argv[++i].split(',');
    } else if (arg === '--include-phases') {
      args.includePhases = true;
    } else if (arg === '--include-diagrams') {
      args.includeDiagrams = true;
    } else if (arg === '--detail-level' || arg === '-d') {
      args.detailLevel = process.argv[++i];
    } else if (arg === '--verbose' || arg === '-v') {
      args.verbose = true;
    }
  }

  return args;
}

/**
 * Affiche l'aide du générateur de documentation
 */
function showHelp(): void {
  console.log(`
📚 Générateur de Documentation Automatique - Migration Angular 5 → 20

Ce générateur crée automatiquement une documentation complète et détaillée
pour le projet de migration Angular, incluant :
- Documentation API extraite des commentaires JSDoc
- Statistiques du projet et métriques de qualité
- Guides d'utilisation et exemples
- Diagrammes d'architecture
- Documentation par phase de migration
- Recommandations d'amélioration

Usage:
  node tools/doc-generator/index.js [options]

Options:
  -p, --project-path <path>    Chemin vers le projet à documenter (requis)
  -o, --output-path <path>     Chemin de sortie pour la documentation (défaut: ./docs/generated)
  -f, --formats <formats>      Formats de sortie séparés par des virgules (défaut: html,markdown,json)
  --include-phases             Inclure la documentation par phase de migration
  --include-diagrams           Inclure les diagrammes d'architecture et de dépendances
  -d, --detail-level <level>   Niveau de détail: basic, detailed, comprehensive (défaut: detailed)
  -v, --verbose                Mode verbeux
  -h, --help                   Afficher cette aide

Formats supportés:
  - html       Documentation HTML interactive avec navigation
  - markdown   Documentation Markdown pour GitHub/GitLab
  - json       Documentation structurée en JSON pour traitement automatique

Exemples:
  # Documentation basique
  node tools/doc-generator/index.js -p /path/to/project

  # Documentation complète avec tous les formats
  node tools/doc-generator/index.js -p /path/to/project -f html,markdown,json --include-phases --include-diagrams

  # Documentation détaillée avec diagrammes
  node tools/doc-generator/index.js -p /path/to/project --include-diagrams -d comprehensive

  # Documentation par phase uniquement
  node tools/doc-generator/index.js -p /path/to/project --include-phases -f markdown

Fonctionnalités:
  ✅ Extraction automatique des commentaires JSDoc
  ✅ Analyse des métadonnées du projet (package.json, README.md)
  ✅ Calcul des statistiques de code (lignes, commentaires, complexité)
  ✅ Génération de documentation API (classes, interfaces, fonctions)
  ✅ Création de diagrammes d'architecture (Mermaid)
  ✅ Documentation par phase de migration
  ✅ Recommandations d'amélioration du code
  ✅ Support multi-formats (HTML, Markdown, JSON)
  ✅ Mode verbeux pour le debugging

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

Qualité du code:
  - Taux de commentaires recommandé: 15-30%
  - Complexité cyclomatique recommandée: < 10
  - Taille de fichier recommandée: < 500 lignes
  - Couverture de tests recommandée: > 80%

Support:
  - Issues: https://github.com/bigmoletos/migration_angular_5_to_20/issues
  - Documentation: https://github.com/bigmoletos/migration_angular_5_to_20/wiki
  - Discussions: https://github.com/bigmoletos/migration_angular_5_to_20/discussions

Version: 1.0.0
Auteur: Migration Angular Team
Licence: MIT
`);
}

/**
 * Gestion des erreurs non capturées
 */
process.on('uncaughtException', (error) => {
  logger.error('💥 Erreur non capturée', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Promesse rejetée non gérée', { reason, promise });
  process.exit(1);
});

// Exécution du script
if (require.main === module) {
  main().catch(error => {
    logger.error('💥 Erreur non gérée dans le générateur de documentation', error);
    process.exit(1);
  });
}
