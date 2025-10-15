#!/usr/bin/env node

import * as commander from 'commander';
import * as inquirer from 'inquirer';
import * as path from 'path';
import { BackendAgnosticMigrationEngine } from './core/BackendAgnosticMigrationEngine';
import { MigrationOptions, MigrationMode } from './types';
import { Logger } from './utils/Logger';

/**
 * Point d'entrée principal de l'outil de migration Angular
 * Compatible avec tous types de backends (Java, Python, Node.js, .NET, etc.)
 */

const program = new commander.Command();
const logger = new Logger();

program
  .name('angular-migration-tool')
  .description('Outil de migration automatisée d\'Angular 5 vers Angular 20')
  .version('1.0.0');

program
  .command('migrate')
  .description('Migrer un projet Angular 5 vers Angular 20')
  .option('-p, --path <path>', 'Chemin vers le projet à migrer')
  .option('-m, --mode <mode>', 'Mode de migration (analyze|migrate|dry-run)', 'analyze')
  .option('-a, --auto-apply', 'Appliquer les transformations automatiquement', false)
  .option('-b, --backup', 'Créer une sauvegarde avant migration', true)
  .option('-v, --verbose', 'Mode verbeux', false)
  .option('-r, --report', 'Générer un rapport détaillé', true)
  .option('-e, --exclude <patterns>', 'Patterns de fichiers à exclure (séparés par des virgules)')
  .option('-i, --include <patterns>', 'Patterns de fichiers à inclure uniquement (séparés par des virgules)')
  .action(async (options) => {
    try {
      await runMigration(options);
    } catch (error) {
      logger.error(`Erreur lors de la migration: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyser un projet sans appliquer de transformations')
  .option('-p, --path <path>', 'Chemin vers le projet à analyser')
  .option('-v, --verbose', 'Mode verbeux', false)
  .option('-r, --report', 'Générer un rapport détaillé', true)
  .action(async (options) => {
    try {
      const migrationOptions: MigrationOptions = {
        mode: MigrationMode.ANALYZE,
        backup: false,
        autoApply: false,
        exclude: options.exclude ? options.exclude.split(',') : [],
        include: options.include ? options.include.split(',') : [],
        verbose: options.verbose || false,
        generateReport: options.report || false
      };

      await runMigration({ ...options, ...migrationOptions });
    } catch (error) {
      logger.error(`Erreur lors de l'analyse: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('Migrer plusieurs projets en lot')
  .option('-d, --directory <path>', 'Répertoire contenant les projets à migrer')
  .option('-m, --mode <mode>', 'Mode de migration (analyze|migrate|dry-run)', 'analyze')
  .option('-a, --auto-apply', 'Appliquer les transformations automatiquement', false)
  .option('-v, --verbose', 'Mode verbeux', false)
  .action(async (options) => {
    try {
      await runBatchMigration(options);
    } catch (error) {
      logger.error(`Erreur lors de la migration en lot: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Mode interactif pour guider la migration')
  .action(async () => {
    try {
      await runInteractiveMode();
    } catch (error) {
      logger.error(`Erreur en mode interactif: ${error.message}`);
      process.exit(1);
    }
  });

/**
 * Exécute la migration d'un projet
 */
async function runMigration(options: any): Promise<void> {
  const projectPath = options.path || process.cwd();

  if (!projectPath) {
    logger.error('Chemin du projet non spécifié');
    return;
  }

  logger.section('🚀 Migration Angular 5 → Angular 20');
  logger.info(`📁 Projet: ${projectPath}`);
  logger.info(`🎯 Mode: ${options.mode}`);

  const migrationOptions: MigrationOptions = {
    mode: options.mode as MigrationMode,
    backup: options.backup,
    autoApply: options.autoApply,
    exclude: options.exclude ? options.exclude.split(',') : [],
    include: options.include ? options.include.split(',') : [],
    verbose: options.verbose,
    generateReport: options.report
  };

  const engine = new BackendAgnosticMigrationEngine();
  const report = await engine.migrateProject(projectPath, migrationOptions);

  // Affichage du résumé
  logger.section('📊 Résumé de la Migration');
  logger.table([
    { Métrique: 'Fichiers analysés', Valeur: report.summary.totalFiles },
    { Métrique: 'Fichiers modifiés', Valeur: report.summary.modifiedFiles },
    { Métrique: 'Issues détectées', Valeur: report.summary.totalIssues },
    { Métrique: 'Transformations appliquées', Valeur: report.summary.appliedTransformations },
    { Métrique: 'Transformations échouées', Valeur: report.summary.failedTransformations },
    { Métrique: 'Temps d\'exécution', Valeur: `${report.executionTime}ms` }
  ], ['Métrique', 'Valeur']);

  if (report.recommendations.length > 0) {
    logger.section('💡 Recommandations');
    report.recommendations.forEach(rec => logger.info(`• ${rec}`));
  }

  if (report.errors.length > 0) {
    logger.section('❌ Erreurs');
    report.errors.forEach(error => logger.error(error));
  }
}

/**
 * Exécute la migration en lot
 */
async function runBatchMigration(options: any): Promise<void> {
  const directory = options.directory || process.cwd();

  logger.section('🔄 Migration en Lot');
  logger.info(`📁 Répertoire: ${directory}`);

  // Rechercher tous les projets Angular dans le répertoire
  const projects = await findAngularProjects(directory);

  if (projects.length === 0) {
    logger.warn('Aucun projet Angular trouvé dans le répertoire');
    return;
  }

  logger.info(`📦 ${projects.length} projet(s) Angular trouvé(s)`);

  const migrationOptions: MigrationOptions = {
    mode: options.mode as MigrationMode,
    backup: true,
    autoApply: options.autoApply,
    exclude: [],
    include: [],
    verbose: options.verbose,
    generateReport: true
  };

  const engine = new BackendAgnosticMigrationEngine();
  const results = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    logger.info(`\n🔄 Migration ${i + 1}/${projects.length}: ${project}`);

    try {
      const report = await engine.migrateProject(project, migrationOptions);
      results.push({ project, report, success: true });
      logger.success(`✅ Migration réussie: ${project}`);
    } catch (error) {
      results.push({ project, error: error.message, success: false });
      logger.error(`❌ Échec de la migration: ${project} - ${error.message}`);
    }
  }

  // Résumé des résultats
  logger.section('📊 Résumé des Migrations en Lot');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  logger.table([
    { Projet: 'Total', Statut: `${results.length} projets` },
    { Projet: 'Réussis', Statut: `${successful} projets` },
    { Projet: 'Échoués', Statut: `${failed} projets` }
  ], ['Projet', 'Statut']);

  if (failed > 0) {
    logger.section('❌ Projets en Échec');
    results.filter(r => !r.success).forEach(result => {
      logger.error(`${result.project}: ${result.error}`);
    });
  }
}

/**
 * Mode interactif pour guider la migration
 */
async function runInteractiveMode(): Promise<void> {
  logger.section('🎯 Mode Interactif - Migration Angular');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: 'Chemin vers le projet à migrer:',
      default: process.cwd(),
      validate: (input) => input.length > 0 || 'Le chemin ne peut pas être vide'
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Mode de migration:',
      choices: [
        { name: 'Analyse uniquement (recommandé)', value: 'analyze' },
        { name: 'Migration complète', value: 'migrate' },
        { name: 'Dry-run (simulation)', value: 'dry_run' }
      ]
    },
    {
      type: 'confirm',
      name: 'backup',
      message: 'Créer une sauvegarde avant migration?',
      default: true
    },
    {
      type: 'confirm',
      name: 'autoApply',
      message: 'Appliquer les transformations automatiquement?',
      default: false,
      when: (answers) => answers.mode !== 'analyze'
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Mode verbeux?',
      default: false
    },
    {
      type: 'confirm',
      name: 'generateReport',
      message: 'Générer un rapport détaillé?',
      default: true
    }
  ]);

  const migrationOptions: MigrationOptions = {
    mode: answers.mode as MigrationMode,
    backup: answers.backup,
    autoApply: answers.autoApply,
    exclude: [],
    include: [],
    verbose: answers.verbose,
    generateReport: answers.generateReport
  };

  await runMigration({ path: answers.projectPath, ...migrationOptions });
}

/**
 * Trouve tous les projets Angular dans un répertoire
 */
async function findAngularProjects(directory: string): Promise<string[]> {
  // Implémentation simplifiée - en réalité, on utiliserait une recherche récursive
  // plus sophistiquée pour trouver tous les projets Angular
  return [directory]; // Pour l'exemple
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Erreur non gérée: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error(`Exception non gérée: ${error.message}`);
  process.exit(1);
});

// Lancement du programme
if (require.main === module) {
  program.parse();
}
