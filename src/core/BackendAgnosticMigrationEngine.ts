import * as fs from 'fs-extra';
import * as path from 'path';
import { AngularProject, MigrationOptions, MigrationReport, FileType, MigrationMode } from '../types';
import { ProjectAnalyzer } from '../analyzers/ProjectAnalyzer';
import { Angular5Analyzer } from '../analyzers/Angular5Analyzer';
import { ModernizationTransformer } from '../transformers/ModernizationTransformer';
import { ReportGenerator } from '../utils/ReportGenerator';
import { Logger } from '../utils/Logger';

/**
 * Moteur de migration Angular agnostique du backend
 * Fonctionne avec Java, Python, Node.js, .NET, PHP, etc.
 */
export class BackendAgnosticMigrationEngine {
  private logger: Logger;
  private projectAnalyzer: ProjectAnalyzer;
  private angular5Analyzer: Angular5Analyzer;
  private transformer: ModernizationTransformer;
  private reportGenerator: ReportGenerator;

  constructor() {
    this.logger = new Logger();
    this.projectAnalyzer = new ProjectAnalyzer();
    this.angular5Analyzer = new Angular5Analyzer();
    this.transformer = new ModernizationTransformer();
    this.reportGenerator = new ReportGenerator();
  }

  /**
   * Lance le processus de migration pour un projet Angular
   * Compatible avec tous types de backends
   */
  async migrateProject(projectPath: string, options: MigrationOptions): Promise<MigrationReport> {
    const startTime = Date.now();

    try {
      this.logger.info(`🚀 Début de la migration du projet: ${projectPath}`);

      // 1. Détection automatique du type de backend
      const backendType = await this.detectBackendType(projectPath);
      this.logger.info(`🔍 Backend détecté: ${backendType}`);

      // 2. Analyse du projet Angular (frontend uniquement)
      this.logger.info('📋 Analyse du projet Angular...');
      const project = await this.analyzeAngularProject(projectPath, backendType);

      // 3. Détection des patterns Angular 5
      this.logger.info('🔍 Détection des patterns Angular 5...');
      await this.detectAngular5Patterns(project);

      // 4. Application des transformations Angular uniquement
      if (options.mode !== MigrationMode.ANALYZE) {
        this.logger.info('⚡ Application des transformations Angular...');
        await this.applyAngularTransformations(project, options);
      }

      // 5. Génération du rapport
      this.logger.info('📊 Génération du rapport...');
      const report = await this.generateReport(project, options, startTime, backendType);

      this.logger.success(`✅ Migration Angular terminée en ${Date.now() - startTime}ms`);
      return report;

    } catch (error) {
      this.logger.error(`❌ Erreur lors de la migration: ${error.message}`);
      throw error;
    }
  }

  /**
   * Détecte automatiquement le type de backend
   */
  private async detectBackendType(projectPath: string): Promise<string> {
    const backendIndicators = {
      'Java': ['pom.xml', 'build.gradle', 'src/main/java', 'application.properties'],
      'Python': ['requirements.txt', 'setup.py', 'main.py', 'app.py', 'Django', 'Flask'],
      'Node.js': ['package.json', 'server.js', 'app.js', 'index.js'],
      '.NET': ['*.csproj', '*.sln', 'Program.cs', 'Startup.cs'],
      'PHP': ['composer.json', 'index.php', 'app.php'],
      'Go': ['go.mod', 'main.go', '*.go'],
      'Ruby': ['Gemfile', 'config.ru', '*.rb'],
      'Rust': ['Cargo.toml', 'src/main.rs']
    };

    for (const [backend, indicators] of Object.entries(backendIndicators)) {
      for (const indicator of indicators) {
        if (await this.checkBackendIndicator(projectPath, indicator)) {
          return backend;
        }
      }
    }

    return 'Inconnu';
  }

  /**
   * Vérifie la présence d'un indicateur de backend
   */
  private async checkBackendIndicator(projectPath: string, indicator: string): Promise<boolean> {
    try {
      // Vérifier les fichiers
      if (indicator.includes('.')) {
        const files = await fs.readdir(projectPath, { recursive: true });
        return files.some(file => file.includes(indicator));
      }

      // Vérifier les dossiers
      const fullPath = path.join(projectPath, indicator);
      return await fs.pathExists(fullPath);
    } catch {
      return false;
    }
  }

  /**
   * Analyse uniquement la partie Angular du projet
   */
  private async analyzeAngularProject(projectPath: string, backendType: string): Promise<AngularProject> {
    try {
      // Rechercher le dossier frontend/angular
      const angularPaths = await this.findAngularDirectories(projectPath);

      if (angularPaths.length === 0) {
        throw new Error('Aucun projet Angular trouvé dans le répertoire');
      }

      // Utiliser le premier projet Angular trouvé
      const angularPath = angularPaths[0];
      this.logger.info(`📁 Projet Angular trouvé: ${angularPath}`);

      const project = await this.projectAnalyzer.analyze(angularPath);

      // Ajouter des métadonnées sur le backend
      project.config = {
        ...project.config,
        backendType,
        backendPath: projectPath
      };

      this.logger.info(`📦 Projet Angular ${project.currentVersion} détecté`);
      this.logger.info(`🎯 Migration vers Angular ${project.targetVersion}`);
      this.logger.info(`🔗 Backend associé: ${backendType}`);

      return project;
    } catch (error) {
      this.logger.error(`Erreur lors de l'analyse du projet Angular: ${error.message}`);
      throw error;
    }
  }

  /**
   * Trouve les dossiers contenant des projets Angular
   */
  private async findAngularDirectories(projectPath: string): Promise<string[]> {
    const angularPaths: string[] = [];

    try {
      // Vérifier le répertoire racine
      if (await this.isAngularProject(projectPath)) {
        angularPaths.push(projectPath);
      }

      // Rechercher dans les sous-dossiers
      const subdirs = await fs.readdir(projectPath, { withFileTypes: true });

      for (const subdir of subdirs) {
        if (subdir.isDirectory()) {
          const subPath = path.join(projectPath, subdir.name);

          // Ignorer les dossiers de backend courants
          const backendDirs = ['backend', 'server', 'api', 'src/main/java', 'src/main/resources'];
          if (backendDirs.some(dir => subPath.includes(dir))) {
            continue;
          }

          if (await this.isAngularProject(subPath)) {
            angularPaths.push(subPath);
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Erreur lors de la recherche des projets Angular: ${error.message}`);
    }

    return angularPaths;
  }

  /**
   * Vérifie si un répertoire contient un projet Angular
   */
  private async isAngularProject(dirPath: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(dirPath, 'package.json');
      const angularJsonPath = path.join(dirPath, 'angular.json');

      if (!(await fs.pathExists(packageJsonPath)) || !(await fs.pathExists(angularJsonPath))) {
        return false;
      }

      const packageJson = await fs.readJson(packageJsonPath);
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      return dependencies['@angular/core'] !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Détecte les patterns spécifiques à Angular 5
   */
  private async detectAngular5Patterns(project: AngularProject): Promise<void> {
    for (const file of project.files) {
      try {
        const issues = await this.angular5Analyzer.analyzeFile(file);
        file.issues.push(...issues);

        if (issues.length > 0) {
          this.logger.info(`🔍 ${issues.length} issue(s) détectée(s) dans ${file.path}`);
        }
      } catch (error) {
        this.logger.warn(`Erreur lors de l'analyse de ${file.path}: ${error.message}`);
      }
    }
  }

  /**
   * Applique les transformations Angular uniquement
   */
  private async applyAngularTransformations(project: AngularProject, options: MigrationOptions): Promise<void> {
    for (const file of project.files) {
      if (this.shouldProcessFile(file, options)) {
        try {
          const transformations = await this.transformer.transformFile(file, options);
          file.transformations.push(...transformations);

          if (transformations.length > 0) {
            this.logger.info(`⚡ ${transformations.length} transformation(s) appliquée(s) à ${file.path}`);
          }
        } catch (error) {
          this.logger.error(`Erreur lors de la transformation de ${file.path}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Génère le rapport de migration
   */
  private async generateReport(
    project: AngularProject,
    options: MigrationOptions,
    startTime: number,
    backendType: string
  ): Promise<MigrationReport> {
    const executionTime = Date.now() - startTime;

    const report: MigrationReport = {
      project,
      options,
      summary: this.calculateSummary(project),
      fileDetails: project.files.map(file => ({
        file,
        issues: file.issues,
        transformations: file.transformations,
        processingTime: 0
      })),
      errors: [],
      recommendations: this.generateRecommendations(project, backendType),
      executionTime
    };

    if (options.generateReport) {
      await this.reportGenerator.generateReport(report);
    }

    return report;
  }

  /**
   * Détermine si un fichier doit être traité
   */
  private shouldProcessFile(file: any, options: MigrationOptions): boolean {
    // Vérifier les exclusions
    if (options.exclude.some(pattern => file.path.includes(pattern))) {
      return false;
    }

    // Vérifier les inclusions
    if (options.include.length > 0 && !options.include.some(pattern => file.path.includes(pattern))) {
      return false;
    }

    return true;
  }

  /**
   * Calcule le résumé de la migration
   */
  private calculateSummary(project: AngularProject) {
    const totalFiles = project.files.length;
    const modifiedFiles = project.files.filter(f => f.transformations.length > 0).length;
    const totalIssues = project.files.reduce((sum, f) => sum + f.issues.length, 0);
    const appliedTransformations = project.files.reduce(
      (sum, f) => sum + f.transformations.filter(t => t.status === 'applied').length,
      0
    );
    const failedTransformations = project.files.reduce(
      (sum, f) => sum + f.transformations.filter(t => t.status === 'failed').length,
      0
    );

    return {
      totalFiles,
      modifiedFiles,
      totalIssues,
      appliedTransformations,
      failedTransformations
    };
  }

  /**
   * Génère des recommandations basées sur l'analyse et le backend
   */
  private generateRecommendations(project: AngularProject, backendType: string): string[] {
    const recommendations: string[] = [];

    // Recommandations générales Angular
    const hasNgModules = project.files.some(f => f.type === FileType.MODULE);
    if (hasNgModules) {
      recommendations.push('Considérez la migration vers les composants standalone pour simplifier l\'architecture');
    }

    const hasOldControlFlow = project.files.some(f =>
      f.content.includes('*ngIf') || f.content.includes('*ngFor')
    );
    if (hasOldControlFlow) {
      recommendations.push('Migrez vers le nouveau contrôle de flux (@if, @for) pour de meilleures performances');
    }

    const hasUntypedForms = project.files.some(f =>
      f.content.includes('FormGroup') && !f.content.includes('FormGroup<')
    );
    if (hasUntypedForms) {
      recommendations.push('Ajoutez des types stricts aux formulaires réactifs pour une meilleure sécurité de type');
    }

    // Recommandations spécifiques au backend
    switch (backendType) {
      case 'Java':
        recommendations.push('Vérifiez la compatibilité des endpoints REST avec Spring Boot 3+');
        recommendations.push('Considérez l\'utilisation de Spring WebFlux pour la réactivité');
        break;
      case 'Python':
        recommendations.push('Vérifiez la compatibilité avec FastAPI ou Django REST Framework');
        recommendations.push('Considérez l\'utilisation d\'async/await pour les performances');
        break;
      case 'Node.js':
        recommendations.push('Vérifiez la compatibilité avec Express.js ou NestJS');
        recommendations.push('Considérez l\'utilisation de TypeScript côté backend');
        break;
      case '.NET':
        recommendations.push('Vérifiez la compatibilité avec ASP.NET Core 6+');
        recommendations.push('Considérez l\'utilisation de Minimal APIs');
        break;
    }

    // Recommandations de sécurité
    recommendations.push('Implémentez CORS correctement pour la communication frontend-backend');
    recommendations.push('Utilisez HTTPS en production pour toutes les communications');
    recommendations.push('Implémentez une authentification JWT ou OAuth2');

    return recommendations;
  }
}
