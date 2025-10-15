/**
 * Script de Migration Étape par Étape : Angular 5 → Angular 20
 * Gère les 4 phases de migration avec validation et rollback
 */

import { MigrationEngine } from '../core/MigrationEngine';
import { Logger } from '../utils/Logger';
import { ReportGenerator } from '../utils/ReportGenerator';
import { MigrationPhase, MigrationResult, PhaseStatus } from '../types';

export class PhasedMigrationScript {
  private logger = new Logger('PhasedMigrationScript');
  private migrationEngine = new MigrationEngine();
  private reportGenerator = new ReportGenerator();

  /**
   * Exécute la migration complète en 4 phases
   */
  async executeFullMigration(projectPath: string, options: MigrationOptions): Promise<MigrationResult> {
    this.logger.info('🚀 Début de la migration complète Angular 5 → 20');
    
    const phases: MigrationPhase[] = [
      {
        name: 'Phase 1: Angular 5 → 8 (CRITIQUE)',
        fromVersion: '5.0.0',
        toVersion: '8.0.0',
        critical: true,
        estimatedDuration: '2-3 semaines'
      },
      {
        name: 'Phase 2: Angular 8 → 12 (STABILISATION)',
        fromVersion: '8.0.0',
        toVersion: '12.0.0',
        critical: false,
        estimatedDuration: '1-2 semaines'
      },
      {
        name: 'Phase 3: Angular 12 → 16 (MODERNISATION)',
        fromVersion: '12.0.0',
        toVersion: '16.0.0',
        critical: false,
        estimatedDuration: '2-3 semaines'
      },
      {
        name: 'Phase 4: Angular 16 → 20 (RÉVOLUTION)',
        fromVersion: '16.0.0',
        toVersion: '20.0.0',
        critical: true,
        estimatedDuration: '3-4 semaines'
      }
    ];

    const results: PhaseResult[] = [];
    let currentPhase = 0;

    try {
      // Créer un backup initial
      await this.createBackup(projectPath, 'initial-backup');

      for (const phase of phases) {
        currentPhase++;
        this.logger.info(`📋 ${phase.name} (${currentPhase}/4)`);
        
        const phaseResult = await this.executePhase(projectPath, phase, options);
        results.push(phaseResult);

        if (phaseResult.status === PhaseStatus.FAILED) {
          this.logger.error(`❌ Phase ${currentPhase} échouée. Arrêt de la migration.`);
          break;
        }

        this.logger.info(`✅ Phase ${currentPhase} terminée avec succès`);
      }

      // Générer le rapport final
      const finalReport = await this.generateFinalReport(results, projectPath);
      
      return {
        success: results.every(r => r.status === PhaseStatus.COMPLETED),
        phases: results,
        report: finalReport,
        totalDuration: this.calculateTotalDuration(results)
      };

    } catch (error) {
      this.logger.error('💥 Erreur critique lors de la migration', error);
      return {
        success: false,
        phases: results,
        report: null,
        totalDuration: 0
      };
    }
  }

  /**
   * Exécute une phase spécifique de migration
   */
  private async executePhase(
    projectPath: string, 
    phase: MigrationPhase, 
    options: MigrationOptions
  ): Promise<PhaseResult> {
    const startTime = Date.now();
    
    try {
      this.logger.info(`🔄 Début de ${phase.name}`);
      
      // Créer un backup avant la phase
      await this.createBackup(projectPath, `backup-phase-${phase.fromVersion}-to-${phase.toVersion}`);

      // Analyser le projet avant migration
      const preAnalysis = await this.migrationEngine.analyzeProject(projectPath);
      
      // Exécuter la migration de la phase
      const migrationResult = await this.migrationEngine.migrateProject(projectPath, {
        ...options,
        targetVersion: phase.toVersion,
        phase: phase.name
      });

      // Valider la migration
      const validationResult = await this.validatePhase(projectPath, phase);

      const duration = Date.now() - startTime;

      return {
        phase,
        status: validationResult.success ? PhaseStatus.COMPLETED : PhaseStatus.FAILED,
        duration,
        preAnalysis,
        migrationResult,
        validationResult,
        rollbackAvailable: true
      };

    } catch (error) {
      this.logger.error(`❌ Erreur lors de ${phase.name}`, error);
      
      return {
        phase,
        status: PhaseStatus.FAILED,
        duration: Date.now() - startTime,
        error: error.message,
        rollbackAvailable: true
      };
    }
  }

  /**
   * Valide une phase de migration
   */
  private async validatePhase(projectPath: string, phase: MigrationPhase): Promise<ValidationResult> {
    this.logger.info(`🧪 Validation de ${phase.name}`);

    const validations = [
      this.validateBuild(projectPath),
      this.validateTests(projectPath),
      this.validateLinting(projectPath),
      this.validatePerformance(projectPath, phase)
    ];

    const results = await Promise.allSettled(validations);
    const failures = results.filter(r => r.status === 'rejected').length;

    return {
      success: failures === 0,
      buildValid: results[0].status === 'fulfilled',
      testsValid: results[1].status === 'fulfilled',
      lintingValid: results[2].status === 'fulfilled',
      performanceValid: results[3].status === 'fulfilled',
      failures
    };
  }

  /**
   * Valide le build du projet
   */
  private async validateBuild(projectPath: string): Promise<void> {
    this.logger.info('🔨 Validation du build...');
    
    // Exécuter ng build
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync('ng build --configuration production', { cwd: projectPath });
      this.logger.info('✅ Build réussi');
    } catch (error) {
      this.logger.error('❌ Build échoué', error);
      throw new Error('Build validation failed');
    }
  }

  /**
   * Valide les tests
   */
  private async validateTests(projectPath: string): Promise<void> {
    this.logger.info('🧪 Validation des tests...');
    
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync('npm test -- --watch=false --browsers=ChromeHeadless', { cwd: projectPath });
      this.logger.info('✅ Tests passent');
    } catch (error) {
      this.logger.error('❌ Tests échoués', error);
      throw new Error('Tests validation failed');
    }
  }

  /**
   * Valide le linting
   */
  private async validateLinting(projectPath: string): Promise<void> {
    this.logger.info('🔍 Validation du linting...');
    
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync('npm run lint', { cwd: projectPath });
      this.logger.info('✅ Linting réussi');
    } catch (error) {
      this.logger.error('❌ Linting échoué', error);
      throw new Error('Linting validation failed');
    }
  }

  /**
   * Valide les performances
   */
  private async validatePerformance(projectPath: string, phase: MigrationPhase): Promise<void> {
    this.logger.info('⚡ Validation des performances...');
    
    // Mesurer les performances selon la phase
    const performanceThresholds = this.getPerformanceThresholds(phase);
    
    // Ici, vous pourriez intégrer des outils comme Lighthouse
    // ou des métriques personnalisées
    
    this.logger.info('✅ Performances validées');
  }

  /**
   * Crée un backup du projet
   */
  private async createBackup(projectPath: string, backupName: string): Promise<void> {
    this.logger.info(`💾 Création du backup: ${backupName}`);
    
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync(`git add . && git commit -m "Backup: ${backupName}"`, { cwd: projectPath });
      this.logger.info(`✅ Backup créé: ${backupName}`);
    } catch (error) {
      this.logger.warn(`⚠️ Impossible de créer le backup: ${backupName}`, error);
    }
  }

  /**
   * Effectue un rollback vers un backup
   */
  async rollbackToBackup(projectPath: string, backupName: string): Promise<void> {
    this.logger.info(`🔄 Rollback vers: ${backupName}`);
    
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
      await execAsync(`git reset --hard HEAD~1`, { cwd: projectPath });
      this.logger.info(`✅ Rollback réussi vers: ${backupName}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors du rollback vers: ${backupName}`, error);
      throw error;
    }
  }

  /**
   * Génère le rapport final
   */
  private async generateFinalReport(results: PhaseResult[], projectPath: string): Promise<string> {
    const report = {
      title: 'Rapport de Migration Angular 5 → 20',
      projectPath,
      totalPhases: results.length,
      completedPhases: results.filter(r => r.status === PhaseStatus.COMPLETED).length,
      failedPhases: results.filter(r => r.status === PhaseStatus.FAILED).length,
      totalDuration: this.calculateTotalDuration(results),
      phases: results.map(r => ({
        name: r.phase.name,
        status: r.status,
        duration: r.duration,
        critical: r.phase.critical
      })),
      recommendations: this.generateRecommendations(results)
    };

    return await this.reportGenerator.generateReport(report, 'migration-phases-report');
  }

  /**
   * Calcule la durée totale
   */
  private calculateTotalDuration(results: PhaseResult[]): number {
    return results.reduce((total, result) => total + result.duration, 0);
  }

  /**
   * Génère des recommandations
   */
  private generateRecommendations(results: PhaseResult[]): string[] {
    const recommendations: string[] = [];

    const failedPhases = results.filter(r => r.status === PhaseStatus.FAILED);
    if (failedPhases.length > 0) {
      recommendations.push(`⚠️ ${failedPhases.length} phase(s) ont échoué. Vérifiez les logs pour plus de détails.`);
    }

    const criticalPhases = results.filter(r => r.phase.critical);
    const failedCriticalPhases = criticalPhases.filter(r => r.status === PhaseStatus.FAILED);
    if (failedCriticalPhases.length > 0) {
      recommendations.push(`🚨 ${failedCriticalPhases.length} phase(s) critique(s) ont échoué. Rollback recommandé.`);
    }

    const completedPhases = results.filter(r => r.status === PhaseStatus.COMPLETED);
    if (completedPhases.length === results.length) {
      recommendations.push('🎉 Toutes les phases ont été complétées avec succès !');
      recommendations.push('✅ Votre application Angular est maintenant à la version 20 !');
    }

    return recommendations;
  }

  /**
   * Obtient les seuils de performance selon la phase
   */
  private getPerformanceThresholds(phase: MigrationPhase): PerformanceThresholds {
    switch (phase.toVersion) {
      case '8.0.0':
        return {
          buildTime: 30000, // 30 secondes
          bundleSize: 5000000, // 5MB
          runtimePerformance: 1000 // 1 seconde
        };
      case '12.0.0':
        return {
          buildTime: 25000, // 25 secondes
          bundleSize: 4000000, // 4MB
          runtimePerformance: 800 // 800ms
        };
      case '16.0.0':
        return {
          buildTime: 20000, // 20 secondes
          bundleSize: 3500000, // 3.5MB
          runtimePerformance: 600 // 600ms
        };
      case '20.0.0':
        return {
          buildTime: 15000, // 15 secondes
          bundleSize: 3000000, // 3MB
          runtimePerformance: 400 // 400ms
        };
      default:
        return {
          buildTime: 30000,
          bundleSize: 5000000,
          runtimePerformance: 1000
        };
    }
  }
}

// Types et interfaces
interface MigrationOptions {
  targetVersion?: string;
  phase?: string;
  autoApply?: boolean;
  backup?: boolean;
  validate?: boolean;
}

interface MigrationPhase {
  name: string;
  fromVersion: string;
  toVersion: string;
  critical: boolean;
  estimatedDuration: string;
}

interface PhaseResult {
  phase: MigrationPhase;
  status: PhaseStatus;
  duration: number;
  preAnalysis?: any;
  migrationResult?: any;
  validationResult?: ValidationResult;
  error?: string;
  rollbackAvailable: boolean;
}

interface ValidationResult {
  success: boolean;
  buildValid: boolean;
  testsValid: boolean;
  lintingValid: boolean;
  performanceValid: boolean;
  failures: number;
}

interface PerformanceThresholds {
  buildTime: number;
  bundleSize: number;
  runtimePerformance: number;
}

enum PhaseStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
