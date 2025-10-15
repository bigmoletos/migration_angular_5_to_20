/**
 * Types partagés pour toutes les phases de migration Angular
 */

// Types de base
export interface MigrationOptions {
  projectPath: string;
  targetVersion?: string;
  phase?: string;
  autoApply?: boolean;
  backup?: boolean;
  validate?: boolean;
  verbose?: boolean;
  rollback?: boolean;
}

export interface MigrationResult {
  success: boolean;
  phases?: PhaseResult[];
  report?: string;
  totalDuration?: number;
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
