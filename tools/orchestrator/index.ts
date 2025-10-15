#!/usr/bin/env node

/**
 * Point d'entrée de l'Orchestrateur de Migration Angular 5 → 20
 * Usage: node tools/orchestrator/index.js --project-path=/path/to/project
 */

import { MigrationOrchestrator, MigrationOptions } from './MigrationOrchestrator';
import { Logger } from '../../shared/utils/Logger';

const logger = new Logger('OrchestratorCLI');

async function main() {
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
    const options: MigrationOptions = {
      projectPath: args.projectPath,
      phases: args.phases,
      validate: args.validate !== false, // true par défaut
      backup: args.backup !== false, // true par défaut
      rollback: args.rollback !== false, // true par défaut
      parallel: args.parallel || false,
      verbose: args.verbose || false
    };

    logger.info('🚀 Démarrage de l\'orchestrateur de migration');
    logger.info(`📁 Projet: ${options.projectPath}`);
    logger.info(`📋 Phases: ${options.phases?.join(', ') || 'Toutes'}`);
    logger.info(`✅ Validation: ${options.validate ? 'Activée' : 'Désactivée'}`);
    logger.info(`💾 Backup: ${options.backup ? 'Activé' : 'Désactivé'}`);
    logger.info(`🔄 Rollback: ${options.rollback ? 'Activé' : 'Désactivé'}`);

    // Exécution de la migration
    const orchestrator = new MigrationOrchestrator();
    const result = await orchestrator.executeFullMigration(options);

    // Affichage des résultats
    displayResults(result);

    // Code de sortie
    process.exit(result.success ? 0 : 1);

  } catch (error) {
    logger.error('💥 Erreur critique dans l\'orchestrateur', error);
    process.exit(1);
  }
}

/**
 * Parse les arguments de ligne de commande
 */
function parseArguments(): any {
  const args: any = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--project-path' || arg === '-p') {
      args.projectPath = process.argv[++i];
    } else if (arg === '--phases' || arg === '-ph') {
      args.phases = process.argv[++i].split(',');
    } else if (arg === '--no-validate') {
      args.validate = false;
    } else if (arg === '--no-backup') {
      args.backup = false;
    } else if (arg === '--no-rollback') {
      args.rollback = false;
    } else if (arg === '--parallel') {
      args.parallel = true;
    } else if (arg === '--verbose' || arg === '-v') {
      args.verbose = true;
    }
  }

  return args;
}

/**
 * Affiche l'aide
 */
function showHelp() {
  console.log(`
🚀 Orchestrateur de Migration Angular 5 → 20

Usage:
  node tools/orchestrator/index.js [options]

Options:
  -p, --project-path <path>    Chemin vers le projet Angular à migrer
  -ph, --phases <phases>       Phases à exécuter (séparées par des virgules)
  --no-validate               Désactiver la validation après chaque phase
  --no-backup                 Désactiver la création de backups
  --no-rollback               Désactiver le rollback automatique
  --parallel                  Exécuter les phases en parallèle (expérimental)
  -v, --verbose               Mode verbeux
  -h, --help                  Afficher cette aide

Exemples:
  # Migration complète
  node tools/orchestrator/index.js -p /path/to/project

  # Migration de phases spécifiques
  node tools/orchestrator/index.js -p /path/to/project -ph "phase-1-angular-5-to-8,phase-2-angular-8-to-12"

  # Migration sans validation
  node tools/orchestrator/index.js -p /path/to/project --no-validate

  # Migration en mode verbeux
  node tools/orchestrator/index.js -p /path/to/project -v

Phases disponibles:
  - phase-1-angular-5-to-8    Migration critique (RxJS, Build, TypeScript)
  - phase-2-angular-8-to-12   Stabilisation (Ivy, Webpack 5)
  - phase-3-angular-12-to-16  Modernisation (Standalone, inject, Signals)
  - phase-4-angular-16-to-20  Révolution (Control Flow, Zoneless)
`);
}

/**
 * Affiche les résultats de la migration
 */
function displayResults(result: any) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DE LA MIGRATION');
  console.log('='.repeat(60));

  console.log(`\n🎯 Statut global: ${result.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  console.log(`⏱️  Durée totale: ${formatDuration(result.totalDuration)}`);
  console.log(`📋 Phases exécutées: ${result.summary.totalPhases}`);
  console.log(`✅ Phases réussies: ${result.summary.successfulPhases}`);
  console.log(`❌ Phases échouées: ${result.summary.failedPhases}`);
  console.log(`⚠️  Avertissements: ${result.summary.warnings}`);
  console.log(`🚨 Erreurs: ${result.summary.errors}`);

  console.log('\n📋 Détail des phases:');
  result.phases.forEach((phase: any, index: number) => {
    const status = phase.success ? '✅' : '❌';
    const duration = formatDuration(phase.duration);
    console.log(`  ${index + 1}. ${status} ${phase.phase} (${duration})`);

    if (phase.errors && phase.errors.length > 0) {
      console.log(`     Erreurs: ${phase.errors.join(', ')}`);
    }

    if (phase.warnings && phase.warnings.length > 0) {
      console.log(`     Avertissements: ${phase.warnings.length}`);
    }
  });

  if (result.report) {
    console.log(`\n📄 Rapport détaillé: ${result.report}`);
  }

  console.log('\n' + '='.repeat(60));
}

/**
 * Formate la durée en millisecondes
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Exécution du script
if (require.main === module) {
  main().catch(error => {
    logger.error('💥 Erreur non gérée', error);
    process.exit(1);
  });
}
