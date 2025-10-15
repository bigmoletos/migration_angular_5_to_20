import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { AngularProject, ProjectConfig, AngularDependencies, AnalyzedFile, FileType } from '../types';
import { Logger } from '../utils/Logger';

/**
 * Analyseur de projet Angular
 * Détecte la structure, la configuration et les fichiers d'un projet Angular
 */
export class ProjectAnalyzer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Analyse un projet Angular complet
   */
  async analyze(projectPath: string): Promise<AngularProject> {
    try {
      this.logger.info(`🔍 Analyse du projet: ${projectPath}`);
      
      // Vérification de l'existence du projet
      if (!await fs.pathExists(projectPath)) {
        throw new Error(`Le chemin du projet n'existe pas: ${projectPath}`);
      }

      // Analyse de la configuration
      const config = await this.analyzeProjectConfig(projectPath);
      
      // Détection de la version Angular
      const currentVersion = this.extractAngularVersion(config.angularDependencies);
      const targetVersion = '20.0.0';
      
      // Analyse des fichiers
      const files = await this.analyzeProjectFiles(projectPath);
      
      const project: AngularProject = {
        path: projectPath,
        currentVersion,
        targetVersion,
        config,
        files
      };

      this.logger.info(`📊 Projet analysé: ${files.length} fichiers détectés`);
      return project;
      
    } catch (error) {
      this.logger.error(`Erreur lors de l'analyse du projet: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyse la configuration du projet
   */
  private async analyzeProjectConfig(projectPath: string): Promise<ProjectConfig> {
    const config: ProjectConfig = {
      angularDependencies: {} as AngularDependencies
    };

    // Analyse de package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      config.packageJsonPath = packageJsonPath;
      const packageJson = await fs.readJson(packageJsonPath);
      config.angularDependencies = this.extractAngularDependencies(packageJson);
    }

    // Analyse d'angular.json
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (await fs.pathExists(angularJsonPath)) {
      config.angularJsonPath = angularJsonPath;
    }

    // Analyse de tsconfig.json
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      config.tsconfigPath = tsconfigPath;
      config.typescriptConfig = await fs.readJson(tsconfigPath);
    }

    return config;
  }

  /**
   * Extrait les dépendances Angular du package.json
   */
  private extractAngularDependencies(packageJson: any): AngularDependencies {
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const angularDeps: AngularDependencies = {
      core: dependencies['@angular/core'] || 'non trouvé',
      cli: dependencies['@angular/cli'] || 'non trouvé',
      common: dependencies['@angular/common'] || 'non trouvé'
    };

    // Ajouter toutes les autres dépendances Angular
    Object.keys(dependencies).forEach(dep => {
      if (dep.startsWith('@angular/') && !angularDeps[dep]) {
        angularDeps[dep] = dependencies[dep];
      }
    });

    return angularDeps;
  }

  /**
   * Extrait la version principale d'Angular
   */
  private extractAngularVersion(dependencies: AngularDependencies): string {
    const coreVersion = dependencies.core;
    if (coreVersion === 'non trouvé') {
      throw new Error('Version d\'Angular non détectée dans package.json');
    }
    
    // Extraire la version majeure
    const match = coreVersion.match(/^(\d+)\./);
    if (match) {
      return match[1] + '.0.0';
    }
    
    return coreVersion;
  }

  /**
   * Analyse tous les fichiers du projet
   */
  private async analyzeProjectFiles(projectPath: string): Promise<AnalyzedFile[]> {
    const files: AnalyzedFile[] = [];
    
    // Patterns de fichiers à analyser
    const patterns = [
      'src/**/*.ts',
      'src/**/*.html',
      'src/**/*.css',
      'src/**/*.scss',
      'package.json',
      'angular.json',
      'tsconfig.json'
    ];

    for (const pattern of patterns) {
      const filePaths = glob.sync(pattern, { cwd: projectPath, absolute: true });
      
      for (const filePath of filePaths) {
        try {
          const file = await this.analyzeFile(filePath, projectPath);
          files.push(file);
        } catch (error) {
          this.logger.warn(`Erreur lors de l'analyse de ${filePath}: ${error.message}`);
        }
      }
    }

    return files;
  }

  /**
   * Analyse un fichier individuel
   */
  private async analyzeFile(filePath: string, projectPath: string): Promise<AnalyzedFile> {
    const relativePath = path.relative(projectPath, filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const fileType = this.determineFileType(filePath, content);
    
    return {
      path: relativePath,
      type: fileType,
      content,
      issues: [],
      transformations: []
    };
  }

  /**
   * Détermine le type de fichier basé sur le chemin et le contenu
   */
  private determineFileType(filePath: string, content: string): FileType {
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath);

    // Fichiers de configuration
    if (fileName === 'package.json') return FileType.PACKAGE_JSON;
    if (fileName === 'angular.json') return FileType.ANGULAR_JSON;
    if (fileName === 'tsconfig.json') return FileType.TSCONFIG;

    // Fichiers TypeScript
    if (extension === '.ts') {
      if (fileName.includes('.component.')) return FileType.COMPONENT;
      if (fileName.includes('.service.')) return FileType.SERVICE;
      if (fileName.includes('.module.')) return FileType.MODULE;
      if (fileName.includes('.routing.')) return FileType.ROUTING;
      return FileType.OTHER;
    }

    // Fichiers HTML
    if (extension === '.html') return FileType.HTML_TEMPLATE;

    // Fichiers CSS/SCSS
    if (extension === '.css') return FileType.CSS_STYLE;
    if (extension === '.scss') return FileType.SCSS_STYLE;

    return FileType.OTHER;
  }
}
