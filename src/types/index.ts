/**
 * Types de base pour l'outil de migration Angular
 */

export interface AngularProject {
  /** Chemin vers le projet */
  path: string;
  /** Version d'Angular actuelle */
  currentVersion: string;
  /** Version cible d'Angular */
  targetVersion: string;
  /** Configuration du projet */
  config: ProjectConfig;
  /** Fichiers analysés */
  files: AnalyzedFile[];
}

export interface ProjectConfig {
  /** Chemin vers angular.json */
  angularJsonPath?: string;
  /** Chemin vers package.json */
  packageJsonPath?: string;
  /** Chemin vers tsconfig.json */
  tsconfigPath?: string;
  /** Configuration TypeScript */
  typescriptConfig?: any;
  /** Dépendances Angular */
  angularDependencies: AngularDependencies;
}

export interface AngularDependencies {
  /** Version d'Angular Core */
  core: string;
  /** Version d'Angular CLI */
  cli: string;
  /** Version d'Angular Common */
  common: string;
  /** Autres dépendances Angular */
  [key: string]: string;
}

export interface AnalyzedFile {
  /** Chemin du fichier */
  path: string;
  /** Type de fichier */
  type: FileType;
  /** Contenu du fichier */
  content: string;
  /** AST du fichier */
  ast?: any;
  /** Problèmes détectés */
  issues: MigrationIssue[];
  /** Transformations appliquées */
  transformations: Transformation[];
}

export enum FileType {
  COMPONENT = 'component',
  SERVICE = 'service',
  MODULE = 'module',
  ROUTING = 'routing',
  PACKAGE_JSON = 'package.json',
  ANGULAR_JSON = 'angular.json',
  TSCONFIG = 'tsconfig.json',
  HTML_TEMPLATE = 'html',
  CSS_STYLE = 'css',
  SCSS_STYLE = 'scss',
  OTHER = 'other'
}

export interface MigrationIssue {
  /** Type d'issue */
  type: IssueType;
  /** Gravité */
  severity: IssueSeverity;
  /** Message descriptif */
  message: string;
  /** Ligne concernée */
  line?: number;
  /** Colonne concernée */
  column?: number;
  /** Suggestion de correction */
  suggestion?: string;
  /** Code concerné */
  code?: string;
}

export enum IssueType {
  DEPRECATED_API = 'deprecated_api',
  MISSING_IMPORT = 'missing_import',
  INCOMPATIBLE_VERSION = 'incompatible_version',
  STANDALONE_MIGRATION = 'standalone_migration',
  INJECT_MIGRATION = 'inject_migration',
  CONTROL_FLOW_MIGRATION = 'control_flow_migration',
  TYPED_FORMS_MIGRATION = 'typed_forms_migration',
  MODULE_DEPENDENCY = 'module_dependency'
}

export enum IssueSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUGGESTION = 'suggestion'
}

export interface Transformation {
  /** Type de transformation */
  type: TransformationType;
  /** Description */
  description: string;
  /** Code avant transformation */
  before: string;
  /** Code après transformation */
  after: string;
  /** Statut de la transformation */
  status: TransformationStatus;
  /** Erreurs éventuelles */
  errors?: string[];
}

export enum TransformationType {
  CONVERT_TO_STANDALONE = 'convert_to_standalone',
  REPLACE_INJECT = 'replace_inject',
  UPDATE_CONTROL_FLOW = 'update_control_flow',
  UPDATE_TYPED_FORMS = 'update_typed_forms',
  UPDATE_IMPORTS = 'update_imports',
  UPDATE_DEPENDENCIES = 'update_dependencies',
  REMOVE_NGMODULE = 'remove_ngmodule'
}

export enum TransformationStatus {
  PENDING = 'pending',
  APPLIED = 'applied',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

export interface MigrationOptions {
  /** Mode de migration */
  mode: MigrationMode;
  /** Sauvegarder avant migration */
  backup: boolean;
  /** Appliquer les transformations automatiquement */
  autoApply: boolean;
  /** Fichiers à exclure */
  exclude: string[];
  /** Fichiers à inclure uniquement */
  include: string[];
  /** Niveau de verbosité */
  verbose: boolean;
  /** Créer un rapport détaillé */
  generateReport: boolean;
}

export enum MigrationMode {
  /** Analyse uniquement */
  ANALYZE = 'analyze',
  /** Migration complète */
  MIGRATE = 'migrate',
  /** Mode dry-run */
  DRY_RUN = 'dry_run'
}

export interface MigrationReport {
  /** Projet analysé */
  project: AngularProject;
  /** Options utilisées */
  options: MigrationOptions;
  /** Résumé des résultats */
  summary: MigrationSummary;
  /** Détails par fichier */
  fileDetails: FileMigrationDetails[];
  /** Erreurs rencontrées */
  errors: string[];
  /** Recommandations */
  recommendations: string[];
  /** Temps d'exécution */
  executionTime: number;
}

export interface MigrationSummary {
  /** Nombre total de fichiers analysés */
  totalFiles: number;
  /** Nombre de fichiers modifiés */
  modifiedFiles: number;
  /** Nombre total d'issues détectées */
  totalIssues: number;
  /** Nombre de transformations appliquées */
  appliedTransformations: number;
  /** Nombre de transformations échouées */
  failedTransformations: number;
}

export interface FileMigrationDetails {
  /** Fichier concerné */
  file: AnalyzedFile;
  /** Issues détectées */
  issues: MigrationIssue[];
  /** Transformations appliquées */
  transformations: Transformation[];
  /** Temps de traitement */
  processingTime: number;
}
