/**
 * Types partagés pour toutes les phases de migration Angular
 *
 * Ce fichier contient toutes les interfaces, types et énumérations utilisées
 * dans l'ensemble du projet de migration Angular 5 → 20.
 *
 * Organisation :
 * - Types de base pour la migration
 * - Types pour l'analyse des fichiers
 * - Types pour les transformations
 * - Types pour les rapports
 * - Types pour la validation
 * - Types pour les phases
 * - Types pour l'intégration Java
 * - Types pour les métriques
 * - Types pour les logs et erreurs
 * - Types pour les configurations
 *
 * @author Migration Angular Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// ============================================================================
// TYPES DE BASE POUR LA MIGRATION
// ============================================================================

/**
 * Options de configuration pour une migration
 *
 * Cette interface définit tous les paramètres configurables
 * pour l'exécution d'une migration Angular.
 *
 * @interface MigrationOptions
 * @property {string} projectPath - Chemin absolu vers le projet à migrer
 * @property {string} [targetVersion] - Version cible d'Angular (ex: "8.0.0")
 * @property {string} [phase] - Nom de la phase de migration
 * @property {boolean} [autoApply] - Appliquer automatiquement les transformations
 * @property {boolean} [backup] - Créer des backups avant migration
 * @property {boolean} [validate] - Valider le résultat après migration
 * @property {boolean} [verbose] - Mode verbeux pour les logs
 * @property {boolean} [rollback] - Activer le rollback automatique en cas d'erreur
 *
 * @example
 * ```typescript
 * const options: MigrationOptions = {
 *   projectPath: '/path/to/angular-project',
 *   targetVersion: '8.0.0',
 *   phase: 'Phase 1: Angular 5 → 8',
 *   autoApply: true,
 *   backup: true,
 *   validate: true,
 *   verbose: false,
 *   rollback: true
 * };
 * ```
 */
export interface MigrationOptions {
  /** Chemin absolu vers le projet Angular à migrer */
  projectPath: string;
  /** Version cible d'Angular (ex: "8.0.0", "12.0.0", "16.0.0", "20.0.0") */
  targetVersion?: string;
  /** Nom de la phase de migration (ex: "Phase 1: Angular 5 → 8") */
  phase?: string;
  /** Appliquer automatiquement les transformations détectées */
  autoApply?: boolean;
  /** Créer des backups Git avant chaque transformation */
  backup?: boolean;
  /** Valider le résultat avec des tests après migration */
  validate?: boolean;
  /** Mode verbeux pour afficher tous les logs de détail */
  verbose?: boolean;
  /** Activer le rollback automatique en cas d'échec */
  rollback?: boolean;
}

/**
 * Résultat d'une migration Angular
 *
 * Cette interface contient tous les résultats et métadonnées
 * d'une migration Angular, incluant le statut, les phases exécutées,
 * les rapports générés et les statistiques.
 *
 * @interface MigrationResult
 * @property {boolean} success - Indique si la migration s'est terminée avec succès
 * @property {PhaseResult[]} [phases] - Résultats détaillés de chaque phase
 * @property {string} [report] - Chemin vers le rapport de migration généré
 * @property {number} [totalDuration] - Durée totale de la migration en millisecondes
 * @property {MigrationSummary} [summary] - Résumé statistique de la migration
 *
 * @example
 * ```typescript
 * const result: MigrationResult = {
 *   success: true,
 *   phases: [
 *     { phase: 'Phase 1', success: true, duration: 120000 },
 *     { phase: 'Phase 2', success: true, duration: 80000 }
 *   ],
 *   report: './reports/migration-report.html',
 *   totalDuration: 200000,
 *   summary: {
 *     totalPhases: 2,
 *     successfulPhases: 2,
 *     failedPhases: 0,
 *     warnings: 3,
 *     errors: 0
 *   }
 * };
 * ```
 */
export interface MigrationResult {
  /** Indique si la migration s'est terminée avec succès */
  success: boolean;
  /** Résultats détaillés de chaque phase de migration exécutée */
  phases?: PhaseResult[];
  /** Chemin vers le rapport de migration généré (HTML, Markdown, JSON) */
  report?: string;
  /** Durée totale de la migration en millisecondes */
  totalDuration?: number;
  /** Résumé statistique de la migration avec compteurs */
  summary?: MigrationSummary;
}

export interface PhaseResult {
  phase: string;
  success: boolean;
  duration: number;
  errors?: string[];
  warnings?: string[];
  metrics?: any;
  preAnalysis?: any;
  migrationResult?: any;
  validationResult?: any;
  rollbackAvailable?: boolean;
}

export interface MigrationSummary {
  totalPhases: number;
  successfulPhases: number;
  failedPhases: number;
  warnings: number;
  errors: number;
}

// Types pour l'analyse
export interface AnalyzedFile {
  path: string;
  content: string;
  type: FileType;
  size: number;
  lastModified: Date;
  dependencies?: string[];
  imports?: string[];
  exports?: string[];
}

export enum FileType {
  COMPONENT = 'component',
  SERVICE = 'service',
  MODULE = 'module',
  ROUTING = 'routing',
  CONFIG = 'config',
  TEST = 'test',
  OTHER = 'other'
}

export interface MigrationIssue {
  type: IssueType;
  severity: IssueSeverity;
  file: string;
  line?: number;
  column?: number;
  message: string;
  suggestion?: string;
  code?: string;
  fix?: string;
}

export enum IssueType {
  DEPRECATED_API = 'deprecated_api',
  BREAKING_CHANGE = 'breaking_change',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  BACKEND_INTEGRATION = 'backend_integration',
  TESTING = 'testing',
  BUILD = 'build',
  OTHER = 'other'
}

export enum IssueSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// Types pour les transformations
export interface Transformation {
  type: TransformationType;
  description: string;
  before: string;
  after: string;
  status: TransformationStatus;
  file: string;
  line?: number;
  column?: number;
  confidence: number;
  manual?: boolean;
}

export enum TransformationType {
  UPDATE_IMPORTS = 'update_imports',
  UPDATE_SYNTAX = 'update_syntax',
  UPDATE_APIS = 'update_apis',
  UPDATE_CONFIG = 'update_config',
  UPDATE_TESTS = 'update_tests',
  UPDATE_JAVA_INTEGRATION = 'update_java_integration',
  UPDATE_RXJS = 'update_rxjs',
  UPDATE_TYPESCRIPT = 'update_typescript',
  UPDATE_BUILD = 'update_build',
  OTHER = 'other'
}

export enum TransformationStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

// Types pour les rapports
export interface ReportOptions {
  format: ReportFormat;
  outputPath?: string;
  includeDetails?: boolean;
  includeMetrics?: boolean;
  includeRecommendations?: boolean;
}

export enum ReportFormat {
  HTML = 'html',
  JSON = 'json',
  MARKDOWN = 'markdown',
  PDF = 'pdf'
}

// Types pour la validation
export interface ValidationResult {
  success: boolean;
  buildValid: boolean;
  testsValid: boolean;
  lintingValid: boolean;
  performanceValid: boolean;
  failures: number;
  errors?: string[];
  warnings?: string[];
  metrics?: ValidationMetrics;
}

export interface ValidationMetrics {
  buildTime: number;
  bundleSize: number;
  runtimePerformance: number;
  memoryUsage: number;
  testCoverage: number;
  lintingErrors: number;
  lintingWarnings: number;
}

// Types pour les phases
export interface MigrationPhase {
  name: string;
  fromVersion: string;
  toVersion: string;
  critical: boolean;
  estimatedDuration: string;
  riskLevel: RiskLevel;
  changes: string[];
  validation: PhaseValidation;
  rollback: PhaseRollback;
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface PhaseValidation {
  build: boolean;
  tests: boolean;
  linting: boolean;
  performance: boolean;
}

export interface PhaseRollback {
  enabled: boolean;
  automatic: boolean;
  backup: boolean;
}

// Types pour Java + Angular
export interface JavaBackendConfig {
  version: string;
  springBoot: string;
  maven: string;
  endpoints: JavaEndpoints;
  testing: JavaTesting;
  sdk: JavaSDK;
}

export interface JavaEndpoints {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface JavaTesting {
  protractor: boolean;
  cypress: boolean;
  jenkins: boolean;
}

export interface JavaSDK {
  enabled: boolean;
  version: string;
  distribution: string;
}

// Types pour les métriques
export interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  runtimePerformance: number;
  memoryUsage: number;
  testCoverage: number;
  lintingScore: number;
}

export interface MigrationMetrics {
  filesProcessed: number;
  transformationsApplied: number;
  issuesFound: number;
  issuesFixed: number;
  duration: number;
  performance: PerformanceMetrics;
}

// Types pour les logs
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Types pour les erreurs
export interface MigrationError {
  code: string;
  message: string;
  context?: string;
  stack?: string;
  recoverable: boolean;
  suggestions?: string[];
}

// Types pour les configurations
export interface ProjectConfig {
  name: string;
  version: string;
  angularVersion: string;
  typescriptVersion: string;
  rxjsVersion: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export interface MigrationConfig {
  phases: MigrationPhase[];
  validation: ValidationConfig;
  rollback: RollbackConfig;
  reporting: ReportingConfig;
  java: JavaBackendConfig;
}

export interface ValidationConfig {
  enabled: boolean;
  build: boolean;
  tests: boolean;
  linting: boolean;
  performance: boolean;
  thresholds: ValidationThresholds;
}

export interface ValidationThresholds {
  buildTime: number;
  bundleSize: number;
  runtimePerformance: number;
  memoryUsage: number;
  testCoverage: number;
}

export interface RollbackConfig {
  enabled: boolean;
  automatic: boolean;
  backup: boolean;
  retention: string;
}

export interface ReportingConfig {
  enabled: boolean;
  formats: ReportFormat[];
  outputPath: string;
  includeDetails: boolean;
  includeMetrics: boolean;
  includeRecommendations: boolean;
}
