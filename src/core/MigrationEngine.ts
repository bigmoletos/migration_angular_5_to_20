import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';
import { AngularProject, MigrationOptions, MigrationReport, FileType, MigrationMode } from '../types';
import { ProjectAnalyzer } from '../analyzers/ProjectAnalyzer';
import { Angular5Analyzer } from '../analyzers/Angular5Analyzer';
import { ModernizationTransformer } from '../transformers/ModernizationTransformer';
import { ReportGenerator } from '../utils/ReportGenerator';
import { Logger } from '../utils/Logger';

/**
 * Moteur principal de migration Angular
 * Gère le processus complet de migration d'Angular 5 vers Angular 20
 */
export class MigrationEngine {
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
   * Lance le processus de migration pour un projet
   */
  async migrateProject(projectPath: string, options: MigrationOptions): Promise<MigrationReport> {
    const startTime = Date.now();
    
    try {
      this.logger.info(`🚀 Début de la migration du projet: ${projectPath}`);
      
      // 1. Analyse du projet
      this.logger.info('📋 Analyse du projet...');
      const project = await this.analyzeProject(projectPath, options);
      
      // 2. Détection des patterns Angular 5
      this.logger.info('🔍 Détection des patterns Angular 5...');
      await this.detectAngular5Patterns(project);
      
      // 3. Application des transformations
      if (options.mode !== MigrationMode.ANALYZE) {
        this.logger.info('⚡ Application des transformations...');
        await this.applyTransformations(project, options);
      }
      
      // 4. Génération du rapport
      this.logger.info('📊 Génération du rapport...');
      const report = await this.generateReport(project, options, startTime);
      
      this.logger.success(`✅ Migration terminée en ${Date.now() - startTime}ms`);
      return report;
      
    } catch (error) {
      this.logger.error(`❌ Erreur lors de la migration: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyse la structure et la configuration du projet
   */
  private async analyzeProject(projectPath: string, options: MigrationOptions): Promise<AngularProject> {
    try {
      const project = await this.projectAnalyzer.analyze(projectPath);
      
      // Validation de la version Angular
      if (!this.isAngular5Project(project)) {
        throw new Error(`Ce projet n'est pas un projet Angular 5. Version détectée: ${project.currentVersion}`);
      }
      
      this.logger.info(`📦 Projet Angular ${project.currentVersion} détecté`);
      this.logger.info(`🎯 Migration vers Angular ${project.targetVersion}`);
      
      return project;
    } catch (error) {
      this.logger.error(`Erreur lors de l'analyse du projet: ${error.message}`);
      throw error;
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
   * Applique les transformations de modernisation
   */
  private async applyTransformations(project: AngularProject, options: MigrationOptions): Promise<void> {
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
    startTime: number
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
        processingTime: 0 // TODO: Implémenter le tracking du temps
      })),
      errors: [],
      recommendations: this.generateRecommendations(project),
      executionTime
    };

    if (options.generateReport) {
      await this.reportGenerator.generateReport(report);
    }

    return report;
  }

  /**
   * Vérifie si le projet est bien un projet Angular 5
   */
  private isAngular5Project(project: AngularProject): boolean {
    const version = project.currentVersion;
    return version.startsWith('5.') || version === '5.0.0';
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
   * Génère des recommandations basées sur l'analyse
   */
  private generateRecommendations(project: AngularProject): string[] {
    const recommendations: string[] = [];
    
    // Recommandations basées sur les issues détectées
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
    
    return recommendations;
  }
}
