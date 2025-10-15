import { AnalyzedFile, MigrationIssue, IssueType, IssueSeverity, FileType } from '../types';
import { Logger } from '../utils/Logger';

/**
 * Analyseur spécifique pour les patterns Angular 5
 * Détecte les éléments obsolètes et les opportunités de modernisation
 */
export class Angular5Analyzer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Analyse un fichier pour détecter les patterns Angular 5
   */
  async analyzeFile(file: AnalyzedFile): Promise<MigrationIssue[]> {
    const issues: MigrationIssue[] = [];

    try {
      switch (file.type) {
        case FileType.COMPONENT:
          issues.push(...this.analyzeComponent(file));
          break;
        case FileType.SERVICE:
          issues.push(...this.analyzeService(file));
          break;
        case FileType.MODULE:
          issues.push(...this.analyzeModule(file));
          break;
        case FileType.HTML_TEMPLATE:
          issues.push(...this.analyzeTemplate(file));
          break;
        case FileType.PACKAGE_JSON:
          issues.push(...this.analyzePackageJson(file));
          break;
        default:
          // Analyse générale pour les autres types de fichiers
          issues.push(...this.analyzeGeneral(file));
      }

      return issues;
    } catch (error) {
      this.logger.error(`Erreur lors de l'analyse de ${file.path}: ${error.message}`);
      return [];
    }
  }

  /**
   * Analyse un composant Angular 5
   */
  private analyzeComponent(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    // Détection des constructeurs avec injection manuelle
    const constructorInjectionPattern = /constructor\s*\(\s*([^)]+)\s*\)/g;
    let match;
    while ((match = constructorInjectionPattern.exec(content)) !== null) {
      const injectionParams = match[1];
      if (injectionParams.includes('private') || injectionParams.includes('public')) {
        issues.push({
          type: IssueType.INJECT_MIGRATION,
          severity: IssueSeverity.SUGGESTION,
          message: 'Considérez l\'utilisation de la fonction inject() pour l\'injection de dépendances',
          line: this.getLineNumber(content, match.index),
          suggestion: 'Remplacer par: constructor() { this.service = inject(MyService); }',
          code: match[0]
        });
      }
    }

    // Détection des NgModules dans les composants
    if (content.includes('@NgModule')) {
      issues.push({
        type: IssueType.STANDALONE_MIGRATION,
        severity: IssueSeverity.INFO,
        message: 'Ce composant peut être converti en composant standalone',
        suggestion: 'Ajouter standalone: true et importer les dépendances directement'
      });
    }

    // Détection des formulaires non typés
    const formGroupPattern = /FormGroup\s*\(\s*\)/g;
    while ((match = formGroupPattern.exec(content)) !== null) {
      issues.push({
        type: IssueType.TYPED_FORMS_MIGRATION,
        severity: IssueSeverity.WARNING,
        message: 'FormGroup non typé détecté',
        line: this.getLineNumber(content, match.index),
        suggestion: 'Utiliser FormGroup<MyFormInterface>() pour une meilleure sécurité de type',
        code: match[0]
      });
    }

    return issues;
  }

  /**
   * Analyse un service Angular 5
   */
  private analyzeService(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    // Détection des services avec injection manuelle
    const constructorPattern = /constructor\s*\(\s*([^)]+)\s*\)/g;
    let match;
    while ((match = constructorPattern.exec(content)) !== null) {
      const injectionParams = match[1];
      if (injectionParams.includes('private') || injectionParams.includes('public')) {
        issues.push({
          type: IssueType.INJECT_MIGRATION,
          severity: IssueSeverity.SUGGESTION,
          message: 'Migration vers inject() recommandée pour ce service',
          line: this.getLineNumber(content, match.index),
          suggestion: 'Utiliser inject() au lieu de l\'injection par constructeur'
        });
      }
    }

    // Détection des services non standalone
    if (!content.includes('providedIn: \'root\'')) {
      issues.push({
        type: IssueType.STANDALONE_MIGRATION,
        severity: IssueSeverity.INFO,
        message: 'Service non configuré en standalone',
        suggestion: 'Ajouter providedIn: \'root\' dans le décorateur @Injectable'
      });
    }

    return issues;
  }

  /**
   * Analyse un module Angular 5
   */
  private analyzeModule(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    // Détection des NgModules (à migrer vers standalone)
    if (content.includes('@NgModule')) {
      issues.push({
        type: IssueType.STANDALONE_MIGRATION,
        severity: IssueSeverity.WARNING,
        message: 'NgModule détecté - migration vers standalone recommandée',
        suggestion: 'Considérez la migration vers les composants standalone pour simplifier l\'architecture'
      });
    }

    // Détection des imports obsolètes
    const obsoleteImports = [
      'HttpModule',
      'HttpClientModule', // Si mal configuré
      'FormsModule', // Peut être remplacé par des formulaires réactifs
    ];

    for (const importName of obsoleteImports) {
      if (content.includes(importName)) {
        issues.push({
          type: IssueType.DEPRECATED_API,
          severity: IssueSeverity.WARNING,
          message: `Import obsolète détecté: ${importName}`,
          suggestion: `Vérifiez si ${importName} est encore nécessaire ou peut être remplacé`
        });
      }
    }

    return issues;
  }

  /**
   * Analyse un template HTML
   */
  private analyzeTemplate(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    // Détection des directives de contrôle de flux obsolètes
    const controlFlowPatterns = [
      { pattern: /\*ngIf/g, replacement: '@if' },
      { pattern: /\*ngFor/g, replacement: '@for' },
      { pattern: /\*ngSwitch/g, replacement: '@switch' }
    ];

    for (const { pattern, replacement } of controlFlowPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        issues.push({
          type: IssueType.CONTROL_FLOW_MIGRATION,
          severity: IssueSeverity.SUGGESTION,
          message: `Directive de contrôle de flux obsolète: ${match[0]}`,
          line: this.getLineNumber(content, match.index),
          suggestion: `Remplacer par la nouvelle syntaxe: ${replacement}`,
          code: match[0]
        });
      }
    }

    // Détection des pipes obsolètes
    const obsoletePipes = [
      'async', // Peut être remplacé par des observables avec | async
      'json', // Déconseillé en production
    ];

    for (const pipe of obsoletePipes) {
      const pipePattern = new RegExp(`\\|\\s*${pipe}\\b`, 'g');
      let match;
      while ((match = pipePattern.exec(content)) !== null) {
        issues.push({
          type: IssueType.DEPRECATED_API,
          severity: IssueSeverity.INFO,
          message: `Pipe potentiellement obsolète: ${pipe}`,
          line: this.getLineNumber(content, match.index),
          suggestion: `Vérifiez si le pipe ${pipe} est encore nécessaire`
        });
      }
    }

    return issues;
  }

  /**
   * Analyse le package.json
   */
  private analyzePackageJson(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    try {
      const packageJson = JSON.parse(content);
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Vérification des versions Angular
      const angularCore = dependencies['@angular/core'];
      if (angularCore && !angularCore.startsWith('5.')) {
        issues.push({
          type: IssueType.INCOMPATIBLE_VERSION,
          severity: IssueSeverity.ERROR,
          message: `Version Angular incompatible: ${angularCore}`,
          suggestion: 'Ce projet semble déjà migré ou utilise une version non supportée'
        });
      }

      // Détection des dépendances obsolètes
      const obsoleteDependencies = [
        '@angular/http', // Remplacé par HttpClient
        'rxjs-compat', // Plus nécessaire avec RxJS 6+
      ];

      for (const dep of obsoleteDependencies) {
        if (dependencies[dep]) {
          issues.push({
            type: IssueType.DEPRECATED_API,
            severity: IssueSeverity.WARNING,
            message: `Dépendance obsolète: ${dep}`,
            suggestion: `Supprimer ${dep} et migrer vers les alternatives modernes`
          });
        }
      }

    } catch (error) {
      issues.push({
        type: IssueType.DEPRECATED_API,
        severity: IssueSeverity.ERROR,
        message: 'Erreur lors de l\'analyse du package.json',
        suggestion: 'Vérifiez la syntaxe JSON du fichier'
      });
    }

    return issues;
  }

  /**
   * Analyse générale pour tous les types de fichiers
   */
  private analyzeGeneral(file: AnalyzedFile): MigrationIssue[] {
    const issues: MigrationIssue[] = [];
    const content = file.content;

    // Détection des imports obsolètes
    const obsoleteImports = [
      '@angular/http',
      'rxjs/operators', // Peut être simplifié
    ];

    for (const importPath of obsoleteImports) {
      if (content.includes(`from '${importPath}'`) || content.includes(`from "${importPath}"`)) {
        issues.push({
          type: IssueType.DEPRECATED_API,
          severity: IssueSeverity.WARNING,
          message: `Import obsolète: ${importPath}`,
          suggestion: `Migrer vers les alternatives modernes pour ${importPath}`
        });
      }
    }

    return issues;
  }

  /**
   * Calcule le numéro de ligne basé sur l'index dans le contenu
   */
  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }
}
