import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { BackendAgnosticMigrationEngine } from '../core/BackendAgnosticMigrationEngine';
import { MigrationOptions, MigrationMode } from '../types';
import { Logger } from '../utils/Logger';

/**
 * Script d'automatisation pour la migration de plusieurs projets Angular
 * Compatible avec tous types de backends
 */
export class BatchMigrationScript {
  private logger: Logger;
  private engine: BackendAgnosticMigrationEngine;

  constructor() {
    this.logger = new Logger();
    this.engine = new BackendAgnosticMigrationEngine();
  }

  /**
   * Exécute la migration en lot pour tous les projets trouvés
   */
  async executeBatchMigration(
    rootDirectory: string,
    options: BatchMigrationOptions
  ): Promise<BatchMigrationResult> {
    this.logger.section('🔄 Migration en Lot - Angular 5 → Angular 20');
    this.logger.info(`📁 Répertoire racine: ${rootDirectory}`);
    this.logger.info(`🎯 Mode: ${options.mode}`);

    try {
      // 1. Découverte des projets Angular
      this.logger.info('🔍 Recherche des projets Angular...');
      const projects = await this.discoverAngularProjects(rootDirectory);

      if (projects.length === 0) {
        this.logger.warn('Aucun projet Angular trouvé');
        return {
          totalProjects: 0,
          successfulMigrations: 0,
          failedMigrations: 0,
          results: [],
          executionTime: 0
        };
      }

      this.logger.info(`📦 ${projects.length} projet(s) Angular trouvé(s)`);

      // 2. Filtrage des projets selon les critères
      const filteredProjects = this.filterProjects(projects, options);
      this.logger.info(`🎯 ${filteredProjects.length} projet(s) sélectionné(s) pour la migration`);

      // 3. Exécution des migrations
      const results = await this.executeMigrations(filteredProjects, options);

      // 4. Génération du rapport global
      await this.generateBatchReport(results, rootDirectory);

      return results;

    } catch (error) {
      this.logger.error(`Erreur lors de la migration en lot: ${error.message}`);
      throw error;
    }
  }

  /**
   * Découvre tous les projets Angular dans un répertoire
   */
  private async discoverAngularProjects(rootDirectory: string): Promise<AngularProjectInfo[]> {
    const projects: AngularProjectInfo[] = [];

    try {
      // Recherche récursive des package.json
      const packageJsonFiles = glob.sync('**/package.json', {
        cwd: rootDirectory,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
      });

      for (const packageJsonPath of packageJsonFiles) {
        try {
          const projectInfo = await this.analyzeProject(packageJsonPath);
          if (projectInfo) {
            projects.push(projectInfo);
          }
        } catch (error) {
          this.logger.warn(`Erreur lors de l'analyse de ${packageJsonPath}: ${error.message}`);
        }
      }

    } catch (error) {
      this.logger.error(`Erreur lors de la découverte des projets: ${error.message}`);
    }

    return projects;
  }

  /**
   * Analyse un projet pour déterminer s'il s'agit d'un projet Angular
   */
  private async analyzeProject(packageJsonPath: string): Promise<AngularProjectInfo | null> {
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Vérifier la présence d'Angular
      if (!dependencies['@angular/core']) {
        return null;
      }

      const projectDir = path.dirname(packageJsonPath);
      const angularJsonPath = path.join(projectDir, 'angular.json');

      // Vérifier la présence d'angular.json
      if (!await fs.pathExists(angularJsonPath)) {
        return null;
      }

      // Détecter la version Angular
      const angularVersion = dependencies['@angular/core'];
      const isAngular5 = angularVersion.startsWith('5.') || angularVersion === '5.0.0';

      // Détecter le type de backend
      const backendType = await this.detectBackendType(projectDir);

      return {
        path: projectDir,
        name: packageJson.name || path.basename(projectDir),
        angularVersion,
        isAngular5,
        backendType,
        packageJsonPath,
        angularJsonPath
      };

    } catch (error) {
      this.logger.warn(`Erreur lors de l'analyse de ${packageJsonPath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Détecte le type de backend associé au projet
   */
  private async detectBackendType(projectDir: string): Promise<string> {
    const backendIndicators = {
      'Java': ['pom.xml', 'build.gradle', 'src/main/java'],
      'Python': ['requirements.txt', 'setup.py', 'main.py', 'app.py'],
      'Node.js': ['server.js', 'app.js', 'index.js'],
      '.NET': ['*.csproj', '*.sln', 'Program.cs'],
      'PHP': ['composer.json', 'index.php'],
      'Go': ['go.mod', 'main.go'],
      'Ruby': ['Gemfile', 'config.ru'],
      'Rust': ['Cargo.toml', 'src/main.rs']
    };

    for (const [backend, indicators] of Object.entries(backendIndicators)) {
      for (const indicator of indicators) {
        if (await this.checkBackendIndicator(projectDir, indicator)) {
          return backend;
        }
      }
    }

    return 'Inconnu';
  }

  /**
   * Vérifie la présence d'un indicateur de backend
   */
  private async checkBackendIndicator(projectDir: string, indicator: string): Promise<boolean> {
    try {
      if (indicator.includes('.')) {
        const files = glob.sync(`**/${indicator}`, { cwd: projectDir, absolute: true });
        return files.length > 0;
      }

      const fullPath = path.join(projectDir, indicator);
      return await fs.pathExists(fullPath);
    } catch {
      return false;
    }
  }

  /**
   * Filtre les projets selon les critères spécifiés
   */
  private filterProjects(projects: AngularProjectInfo[], options: BatchMigrationOptions): AngularProjectInfo[] {
    let filtered = projects;

    // Filtrer par version Angular
    if (options.onlyAngular5) {
      filtered = filtered.filter(p => p.isAngular5);
    }

    // Filtrer par type de backend
    if (options.backendTypes && options.backendTypes.length > 0) {
      filtered = filtered.filter(p => options.backendTypes!.includes(p.backendType));
    }

    // Filtrer par nom de projet
    if (options.projectNames && options.projectNames.length > 0) {
      filtered = filtered.filter(p => options.projectNames!.some(name => p.name.includes(name)));
    }

    // Filtrer par chemin
    if (options.pathPatterns && options.pathPatterns.length > 0) {
      filtered = filtered.filter(p =>
        options.pathPatterns!.some(pattern => p.path.includes(pattern))
      );
    }

    return filtered;
  }

  /**
   * Exécute les migrations pour tous les projets sélectionnés
   */
  private async executeMigrations(
    projects: AngularProjectInfo[],
    options: BatchMigrationOptions
  ): Promise<BatchMigrationResult> {
    const results: ProjectMigrationResult[] = [];
    const startTime = Date.now();

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      this.logger.info(`\n🔄 Migration ${i + 1}/${projects.length}: ${project.name}`);
      this.logger.info(`📁 Chemin: ${project.path}`);
      this.logger.info(`🔗 Backend: ${project.backendType}`);

      try {
        const migrationOptions: MigrationOptions = {
          mode: options.mode,
          backup: options.backup,
          autoApply: options.autoApply,
          exclude: options.exclude || [],
          include: options.include || [],
          verbose: options.verbose,
          generateReport: options.generateReport
        };

        const report = await this.engine.migrateProject(project.path, migrationOptions);

        results.push({
          project,
          report,
          success: true,
          error: null
        });

        this.logger.success(`✅ Migration réussie: ${project.name}`);

      } catch (error) {
        results.push({
          project,
          report: null,
          success: false,
          error: error.message
        });

        this.logger.error(`❌ Échec de la migration: ${project.name} - ${error.message}`);
      }

      // Pause entre les migrations si spécifiée
      if (options.delayBetweenMigrations > 0 && i < projects.length - 1) {
        this.logger.info(`⏳ Pause de ${options.delayBetweenMigrations}ms...`);
        await new Promise(resolve => setTimeout(resolve, options.delayBetweenMigrations));
      }
    }

    const executionTime = Date.now() - startTime;
    const successfulMigrations = results.filter(r => r.success).length;
    const failedMigrations = results.filter(r => !r.success).length;

    return {
      totalProjects: projects.length,
      successfulMigrations,
      failedMigrations,
      results,
      executionTime
    };
  }

  /**
   * Génère un rapport global pour la migration en lot
   */
  private async generateBatchReport(result: BatchMigrationResult, rootDirectory: string): Promise<void> {
    try {
      const reportDir = path.join(rootDirectory, 'batch-migration-reports');
      await fs.ensureDir(reportDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(reportDir, `batch-migration-report-${timestamp}.json`);

      const batchReport = {
        timestamp: new Date().toISOString(),
        rootDirectory,
        summary: {
          totalProjects: result.totalProjects,
          successfulMigrations: result.successfulMigrations,
          failedMigrations: result.failedMigrations,
          executionTime: result.executionTime
        },
        results: result.results.map(r => ({
          project: r.project,
          success: r.success,
          error: r.error,
          summary: r.report?.summary
        }))
      };

      await fs.writeFile(reportPath, JSON.stringify(batchReport, null, 2), 'utf-8');
      this.logger.success(`📊 Rapport de migration en lot généré: ${reportPath}`);

    } catch (error) {
      this.logger.error(`Erreur lors de la génération du rapport: ${error.message}`);
    }
  }
}

/**
 * Options pour la migration en lot
 */
export interface BatchMigrationOptions {
  mode: MigrationMode;
  backup: boolean;
  autoApply: boolean;
  exclude?: string[];
  include?: string[];
  verbose: boolean;
  generateReport: boolean;
  onlyAngular5?: boolean;
  backendTypes?: string[];
  projectNames?: string[];
  pathPatterns?: string[];
  delayBetweenMigrations?: number;
}

/**
 * Informations sur un projet Angular
 */
export interface AngularProjectInfo {
  path: string;
  name: string;
  angularVersion: string;
  isAngular5: boolean;
  backendType: string;
  packageJsonPath: string;
  angularJsonPath: string;
}

/**
 * Résultat de la migration d'un projet
 */
export interface ProjectMigrationResult {
  project: AngularProjectInfo;
  report: any | null;
  success: boolean;
  error: string | null;
}

/**
 * Résultat global de la migration en lot
 */
export interface BatchMigrationResult {
  totalProjects: number;
  successfulMigrations: number;
  failedMigrations: number;
  results: ProjectMigrationResult[];
  executionTime: number;
}
