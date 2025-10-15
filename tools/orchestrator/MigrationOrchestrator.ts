/**
 * Orchestrateur Global de Migration Angular 5 → 20
 * Gère l'exécution séquentielle des 4 phases de migration
 */

import { Logger } from '../../shared/utils/Logger';
import { ReportGenerator } from '../../shared/utils/ReportGenerator';

export interface MigrationOptions {
  projectPath: string;
  phases?: string[];
  validate?: boolean;
  backup?: boolean;
  rollback?: boolean;
  parallel?: boolean;
  verbose?: boolean;
}

export interface PhaseResult {
  phase: string;
  success: boolean;
  duration: number;
  errors?: string[];
  warnings?: string[];
  metrics?: any;
}

export interface MigrationResult {
  success: boolean;
  totalDuration: number;
  phases: PhaseResult[];
  summary: {
    totalPhases: number;
    successfulPhases: number;
    failedPhases: number;
    warnings: number;
    errors: number;
  };
  report?: string;
}

export class MigrationOrchestrator {
  private logger = new Logger('MigrationOrchestrator');
  private reportGenerator = new ReportGenerator();

  /**
   * Exécute la migration complète en 4 phases
   */
  async executeFullMigration(options: MigrationOptions): Promise<MigrationResult> {
    this.logger.info('🚀 Début de la migration complète Angular 5 → 20');

    const startTime = Date.now();
    const phases = options.phases || [
      'phase-1-angular-5-to-8',
      'phase-2-angular-8-to-12',
      'phase-3-angular-12-to-16',
      'phase-4-angular-16-to-20'
    ];

    const results: PhaseResult[] = [];
    let currentPhase = 0;

    try {
      // Créer un backup initial
      if (options.backup) {
        await this.createInitialBackup(options.projectPath);
      }

      // Exécuter les phases
      for (const phase of phases) {
        currentPhase++;
        this.logger.info(`📋 Exécution de ${phase} (${currentPhase}/${phases.length})`);

        const phaseResult = await this.executePhase(options.projectPath, phase, options);
        results.push(phaseResult);

        if (!phaseResult.success) {
          this.logger.error(`❌ Phase ${currentPhase} échouée: ${phase}`);

          if (options.rollback) {
            await this.rollbackToPreviousPhase(options.projectPath, currentPhase - 1);
          }

          break;
        }

        this.logger.info(`✅ Phase ${currentPhase} terminée avec succès: ${phase}`);
      }

      const totalDuration = Date.now() - startTime;
      const summary = this.generateSummary(results);

      // Générer le rapport final
      const report = await this.generateFinalReport(results, options, totalDuration);

      return {
        success: results.every(r => r.success),
        totalDuration,
        phases: results,
        summary,
        report
      };

    } catch (error) {
      this.logger.error('💥 Erreur critique lors de la migration', error);

      return {
        success: false,
        totalDuration: Date.now() - startTime,
        phases: results,
        summary: this.generateSummary(results)
      };
    }
  }

  /**
   * Exécute une phase spécifique
   */
  private async executePhase(
    projectPath: string,
    phase: string,
    options: MigrationOptions
  ): Promise<PhaseResult> {
    const startTime = Date.now();

    try {
      this.logger.info(`🔄 Début de ${phase}`);

      // Créer un backup avant la phase
      if (options.backup) {
        await this.createPhaseBackup(projectPath, phase);
      }

      // Exécuter la migration de la phase
      const migrationResult = await this.runPhaseMigration(projectPath, phase, options);

      // Valider la phase si demandé
      if (options.validate) {
        const validationResult = await this.validatePhase(projectPath, phase);
        if (!validationResult.success) {
          throw new Error(`Validation échouée pour ${phase}: ${validationResult.errors?.join(', ')}`);
        }
      }

      const duration = Date.now() - startTime;

      return {
        phase,
        success: true,
        duration,
        metrics: migrationResult.metrics,
        warnings: migrationResult.warnings
      };

    } catch (error) {
      this.logger.error(`❌ Erreur lors de ${phase}`, error);

      return {
        phase,
        success: false,
        duration: Date.now() - startTime,
        errors: [error.message]
      };
    }
  }

  /**
   * Exécute la migration d'une phase spécifique
   */
  private async runPhaseMigration(
    projectPath: string,
    phase: string,
    options: MigrationOptions
  ): Promise<any> {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const command = `npm run migrate --workspace=${phase}`;
    const env = {
      ...process.env,
      PROJECT_PATH: projectPath,
      VALIDATE: options.validate ? 'true' : 'false',
      BACKUP: options.backup ? 'true' : 'false',
      VERBOSE: options.verbose ? 'true' : 'false'
    };

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        env
      });

      if (stderr && !options.verbose) {
        this.logger.warn(`Avertissements pour ${phase}:`, stderr);
      }

      return {
        success: true,
        output: stdout,
        warnings: stderr ? [stderr] : [],
        metrics: this.extractMetrics(stdout)
      };

    } catch (error) {
      throw new Error(`Échec de la migration ${phase}: ${error.message}`);
    }
  }

  /**
   * Valide une phase de migration
   */
  private async validatePhase(projectPath: string, phase: string): Promise<any> {
    this.logger.info(`🧪 Validation de ${phase}`);

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      // Exécuter les tests
      await execAsync(`npm run validate --workspace=${phase}`, {
        cwd: process.cwd()
      });

      return { success: true };

    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Crée un backup initial
   */
  private async createInitialBackup(projectPath: string): Promise<void> {
    this.logger.info('💾 Création du backup initial');

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync(`git add . && git commit -m "Backup initial avant migration Angular 5→20"`, {
        cwd: projectPath
      });
      this.logger.info('✅ Backup initial créé');
    } catch (error) {
      this.logger.warn('⚠️ Impossible de créer le backup initial', error);
    }
  }

  /**
   * Crée un backup avant une phase
   */
  private async createPhaseBackup(projectPath: string, phase: string): Promise<void> {
    this.logger.info(`💾 Création du backup pour ${phase}`);

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync(`git add . && git commit -m "Backup avant ${phase}"`, {
        cwd: projectPath
      });
      this.logger.info(`✅ Backup créé pour ${phase}`);
    } catch (error) {
      this.logger.warn(`⚠️ Impossible de créer le backup pour ${phase}`, error);
    }
  }

  /**
   * Effectue un rollback vers une phase précédente
   */
  private async rollbackToPreviousPhase(projectPath: string, phaseIndex: number): Promise<void> {
    this.logger.info(`🔄 Rollback vers la phase ${phaseIndex}`);

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      // Rollback vers le commit précédent
      await execAsync(`git reset --hard HEAD~1`, { cwd: projectPath });
      this.logger.info(`✅ Rollback réussi vers la phase ${phaseIndex}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors du rollback vers la phase ${phaseIndex}`, error);
      throw error;
    }
  }

  /**
   * Génère le résumé des résultats
   */
  private generateSummary(results: PhaseResult[]): any {
    const totalPhases = results.length;
    const successfulPhases = results.filter(r => r.success).length;
    const failedPhases = results.filter(r => !r.success).length;
    const warnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
    const errors = results.reduce((sum, r) => sum + (r.errors?.length || 0), 0);

    return {
      totalPhases,
      successfulPhases,
      failedPhases,
      warnings,
      errors
    };
  }

  /**
   * Génère le rapport final
   */
  private async generateFinalReport(
    results: PhaseResult[],
    options: MigrationOptions,
    totalDuration: number
  ): Promise<string> {
    const report = {
      title: 'Rapport de Migration Angular 5 → 20',
      projectPath: options.projectPath,
      totalDuration,
      summary: this.generateSummary(results),
      phases: results.map(r => ({
        name: r.phase,
        success: r.success,
        duration: r.duration,
        errors: r.errors,
        warnings: r.warnings,
        metrics: r.metrics
      })),
      recommendations: this.generateRecommendations(results),
      timestamp: new Date().toISOString()
    };

    return await this.reportGenerator.generateReport(report, 'migration-orchestrator-report');
  }

  /**
   * Génère des recommandations
   */
  private generateRecommendations(results: PhaseResult[]): string[] {
    const recommendations: string[] = [];

    const failedPhases = results.filter(r => !r.success);
    if (failedPhases.length > 0) {
      recommendations.push(`⚠️ ${failedPhases.length} phase(s) ont échoué. Vérifiez les logs pour plus de détails.`);
    }

    const warnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
    if (warnings > 0) {
      recommendations.push(`⚠️ ${warnings} avertissement(s) détecté(s). Vérifiez la documentation.`);
    }

    const successfulPhases = results.filter(r => r.success);
    if (successfulPhases.length === results.length) {
      recommendations.push('🎉 Toutes les phases ont été complétées avec succès !');
      recommendations.push('✅ Votre application Angular est maintenant à la version 20 !');
      recommendations.push('🚀 Profitez des nouvelles fonctionnalités et performances !');
    }

    return recommendations;
  }

  /**
   * Extrait les métriques du output
   */
  private extractMetrics(output: string): any {
    // Extraction des métriques depuis le output
    const metrics: any = {};

    // Exemple d'extraction de métriques
    const buildTimeMatch = output.match(/Build time: (\d+)ms/);
    if (buildTimeMatch) {
      metrics.buildTime = parseInt(buildTimeMatch[1]);
    }

    const bundleSizeMatch = output.match(/Bundle size: (\d+)KB/);
    if (bundleSizeMatch) {
      metrics.bundleSize = parseInt(bundleSizeMatch[1]);
    }

    return metrics;
  }
}
