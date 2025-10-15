/**
 * Générateur de Documentation Automatique
 *
 * Ce module génère automatiquement une documentation complète et détaillée
 * pour tous les fichiers du projet de migration Angular 5 → 20.
 *
 * Fonctionnalités :
 * - Extraction automatique des commentaires JSDoc
 * - Génération de documentation API
 * - Création de guides d'utilisation
 * - Génération de diagrammes d'architecture
 * - Documentation des phases de migration
 * - Rapports de qualité du code
 *
 * @author Migration Angular Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Logger } from '../../shared/utils/Logger';
import { ReportGenerator } from '../../shared/utils/ReportGenerator';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Interface pour les métadonnées d'un fichier
 */
interface FileMetadata {
  /** Chemin relatif du fichier */
  path: string;
  /** Nom du fichier */
  name: string;
  /** Extension du fichier */
  extension: string;
  /** Taille du fichier en octets */
  size: number;
  /** Date de dernière modification */
  lastModified: Date;
  /** Type de fichier (component, service, etc.) */
  type: FileType;
  /** Langage de programmation */
  language: string;
  /** Lignes de code */
  linesOfCode: number;
  /** Lignes de commentaires */
  linesOfComments: number;
  /** Complexité cyclomatique */
  cyclomaticComplexity?: number;
  /** Dépendances du fichier */
  dependencies: string[];
  /** Exports du fichier */
  exports: string[];
  /** Imports du fichier */
  imports: string[];
}

/**
 * Types de fichiers supportés
 */
enum FileType {
  COMPONENT = 'component',
  SERVICE = 'service',
  MODULE = 'module',
  INTERFACE = 'interface',
  TYPE = 'type',
  ENUM = 'enum',
  CLASS = 'class',
  FUNCTION = 'function',
  UTILITY = 'utility',
  CONFIG = 'config',
  TEST = 'test',
  DOCUMENTATION = 'documentation',
  SCRIPT = 'script',
  OTHER = 'other'
}

/**
 * Interface pour les commentaires JSDoc extraits
 */
interface JSDocComment {
  /** Description principale */
  description: string;
  /** Tags JSDoc (@param, @returns, @example, etc.) */
  tags: JSDocTag[];
  /** Ligne de début du commentaire */
  startLine: number;
  /** Ligne de fin du commentaire */
  endLine: number;
  /** Type d'élément documenté (class, function, etc.) */
  elementType: string;
  /** Nom de l'élément documenté */
  elementName: string;
}

/**
 * Interface pour les tags JSDoc
 */
interface JSDocTag {
  /** Nom du tag (@param, @returns, etc.) */
  name: string;
  /** Type associé au tag */
  type?: string;
  /** Nom du paramètre ou de la propriété */
  parameterName?: string;
  /** Description du tag */
  description: string;
  /** Valeur par défaut (pour @param) */
  defaultValue?: string;
  /** Exemple de code (pour @example) */
  example?: string;
}

/**
 * Interface pour la documentation générée
 */
interface GeneratedDocumentation {
  /** Métadonnées du projet */
  project: ProjectMetadata;
  /** Liste des fichiers analysés */
  files: FileMetadata[];
  /** Documentation API extraite */
  api: APIDocumentation;
  /** Statistiques du projet */
  statistics: ProjectStatistics;
  /** Recommandations d'amélioration */
  recommendations: string[];
  /** Date de génération */
  generatedAt: Date;
}

/**
 * Métadonnées du projet
 */
interface ProjectMetadata {
  /** Nom du projet */
  name: string;
  /** Version du projet */
  version: string;
  /** Description du projet */
  description: string;
  /** Auteur(s) du projet */
  authors: string[];
  /** Licence du projet */
  license: string;
  /** Technologies utilisées */
  technologies: string[];
  /** Dépôts Git */
  repositories: string[];
}

/**
 * Documentation API
 */
interface APIDocumentation {
  /** Classes documentées */
  classes: ClassDocumentation[];
  /** Interfaces documentées */
  interfaces: InterfaceDocumentation[];
  /** Fonctions documentées */
  functions: FunctionDocumentation[];
  /** Types documentés */
  types: TypeDocumentation[];
  /** Enums documentés */
  enums: EnumDocumentation[];
}

/**
 * Documentation d'une classe
 */
interface ClassDocumentation {
  /** Nom de la classe */
  name: string;
  /** Description de la classe */
  description: string;
  /** Fichier contenant la classe */
  file: string;
  /** Ligne de début */
  startLine: number;
  /** Ligne de fin */
  endLine: number;
  /** Méthodes publiques */
  methods: MethodDocumentation[];
  /** Propriétés publiques */
  properties: PropertyDocumentation[];
  /** Constructeur */
  constructor?: ConstructorDocumentation;
  /** Héritage */
  extends?: string;
  /** Implémentations */
  implements: string[];
  /** Modificateurs d'accès */
  modifiers: string[];
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'une méthode
 */
interface MethodDocumentation {
  /** Nom de la méthode */
  name: string;
  /** Description de la méthode */
  description: string;
  /** Paramètres */
  parameters: ParameterDocumentation[];
  /** Type de retour */
  returnType: string;
  /** Description du retour */
  returnDescription: string;
  /** Modificateurs d'accès */
  modifiers: string[];
  /** Tags JSDoc */
  tags: JSDocTag[];
  /** Exemples d'utilisation */
  examples: string[];
}

/**
 * Documentation d'un paramètre
 */
interface ParameterDocumentation {
  /** Nom du paramètre */
  name: string;
  /** Type du paramètre */
  type: string;
  /** Description du paramètre */
  description: string;
  /** Valeur par défaut */
  defaultValue?: string;
  /** Paramètre optionnel */
  optional: boolean;
}

/**
 * Documentation d'une propriété
 */
interface PropertyDocumentation {
  /** Nom de la propriété */
  name: string;
  /** Type de la propriété */
  type: string;
  /** Description de la propriété */
  description: string;
  /** Modificateurs d'accès */
  modifiers: string[];
  /** Valeur par défaut */
  defaultValue?: string;
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'un constructeur
 */
interface ConstructorDocumentation {
  /** Description du constructeur */
  description: string;
  /** Paramètres */
  parameters: ParameterDocumentation[];
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'une interface
 */
interface InterfaceDocumentation {
  /** Nom de l'interface */
  name: string;
  /** Description de l'interface */
  description: string;
  /** Fichier contenant l'interface */
  file: string;
  /** Propriétés */
  properties: PropertyDocumentation[];
  /** Méthodes */
  methods: MethodDocumentation[];
  /** Héritage */
  extends: string[];
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'une fonction
 */
interface FunctionDocumentation {
  /** Nom de la fonction */
  name: string;
  /** Description de la fonction */
  description: string;
  /** Fichier contenant la fonction */
  file: string;
  /** Paramètres */
  parameters: ParameterDocumentation[];
  /** Type de retour */
  returnType: string;
  /** Description du retour */
  returnDescription: string;
  /** Modificateurs d'accès */
  modifiers: string[];
  /** Tags JSDoc */
  tags: JSDocTag[];
  /** Exemples d'utilisation */
  examples: string[];
}

/**
 * Documentation d'un type
 */
interface TypeDocumentation {
  /** Nom du type */
  name: string;
  /** Description du type */
  description: string;
  /** Fichier contenant le type */
  file: string;
  /** Définition du type */
  definition: string;
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'un enum
 */
interface EnumDocumentation {
  /** Nom de l'enum */
  name: string;
  /** Description de l'enum */
  description: string;
  /** Fichier contenant l'enum */
  file: string;
  /** Valeurs de l'enum */
  values: EnumValueDocumentation[];
  /** Tags JSDoc */
  tags: JSDocTag[];
}

/**
 * Documentation d'une valeur d'enum
 */
interface EnumValueDocumentation {
  /** Nom de la valeur */
  name: string;
  /** Valeur */
  value: string | number;
  /** Description */
  description: string;
}

/**
 * Statistiques du projet
 */
interface ProjectStatistics {
  /** Nombre total de fichiers */
  totalFiles: number;
  /** Lignes de code totales */
  totalLinesOfCode: number;
  /** Lignes de commentaires totales */
  totalLinesOfComments: number;
  /** Taux de commentaires */
  commentRatio: number;
  /** Complexité moyenne */
  averageComplexity: number;
  /** Répartition par type de fichier */
  fileTypeDistribution: Record<string, number>;
  /** Répartition par langage */
  languageDistribution: Record<string, number>;
  /** Taille moyenne des fichiers */
  averageFileSize: number;
  /** Fichiers les plus complexes */
  mostComplexFiles: FileComplexity[];
  /** Fichiers les plus volumineux */
  largestFiles: FileSize[];
}

/**
 * Complexité d'un fichier
 */
interface FileComplexity {
  /** Chemin du fichier */
  file: string;
  /** Complexité cyclomatique */
  complexity: number;
  /** Nombre de lignes */
  lines: number;
}

/**
 * Taille d'un fichier
 */
interface FileSize {
  /** Chemin du fichier */
  file: string;
  /** Taille en octets */
  size: number;
  /** Nombre de lignes */
  lines: number;
}

/**
 * Générateur de Documentation Automatique
 *
 * Cette classe génère automatiquement une documentation complète
 * pour le projet de migration Angular 5 → 20.
 */
export class DocumentationGenerator {
  private logger = new Logger('DocumentationGenerator');
  private reportGenerator = new ReportGenerator();

  /** Extensions de fichiers supportées */
  private readonly SUPPORTED_EXTENSIONS = ['.ts', '.js', '.json', '.md', '.yml', '.yaml'];

  /** Patterns de fichiers à ignorer */
  private readonly IGNORE_PATTERNS = [
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '*.log',
    '*.tmp',
    '.git/**'
  ];

  /**
   * Génère la documentation complète du projet
   *
   * @param projectPath - Chemin vers le projet à documenter
   * @param outputPath - Chemin de sortie pour la documentation
   * @param options - Options de génération
   * @returns Promise<string> - Chemin vers la documentation générée
   */
  async generateDocumentation(
    projectPath: string,
    outputPath: string = './docs/generated',
    options: DocumentationOptions = {}
  ): Promise<string> {
    this.logger.info('🚀 Début de la génération de documentation');
    this.logger.info(`📁 Projet: ${projectPath}`);
    this.logger.info(`📄 Sortie: ${outputPath}`);

    try {
      // Créer le dossier de sortie
      await this.ensureDirectoryExists(outputPath);

      // Analyser le projet
      const projectMetadata = await this.analyzeProject(projectPath);
      const files = await this.analyzeFiles(projectPath);
      const api = await this.extractAPIDocumentation(files);
      const statistics = await this.calculateStatistics(files);
      const recommendations = await this.generateRecommendations(files, statistics);

      // Créer la documentation
      const documentation: GeneratedDocumentation = {
        project: projectMetadata,
        files,
        api,
        statistics,
        recommendations,
        generatedAt: new Date()
      };

      // Générer les différents formats
      const generatedFiles: string[] = [];

      if (options.formats?.includes('html')) {
        const htmlFile = await this.generateHTMLDocumentation(documentation, outputPath);
        generatedFiles.push(htmlFile);
      }

      if (options.formats?.includes('markdown')) {
        const mdFile = await this.generateMarkdownDocumentation(documentation, outputPath);
        generatedFiles.push(mdFile);
      }

      if (options.formats?.includes('json')) {
        const jsonFile = await this.generateJSONDocumentation(documentation, outputPath);
        generatedFiles.push(jsonFile);
      }

      // Générer la documentation par phase
      if (options.includePhases) {
        const phaseDocs = await this.generatePhaseDocumentation(projectPath, outputPath);
        generatedFiles.push(...phaseDocs);
      }

      // Générer les diagrammes
      if (options.includeDiagrams) {
        const diagramFiles = await this.generateDiagrams(documentation, outputPath);
        generatedFiles.push(...diagramFiles);
      }

      this.logger.info(`✅ Documentation générée avec succès: ${generatedFiles.length} fichiers`);
      generatedFiles.forEach(file => this.logger.info(`  📄 ${file}`));

      return outputPath;

    } catch (error) {
      this.logger.error('❌ Erreur lors de la génération de documentation', error);
      throw error;
    }
  }

  /**
   * Analyse les métadonnées du projet
   *
   * @param projectPath - Chemin vers le projet
   * @returns Promise<ProjectMetadata> - Métadonnées du projet
   */
  private async analyzeProject(projectPath: string): Promise<ProjectMetadata> {
    this.logger.info('📊 Analyse des métadonnées du projet');

    try {
      // Lire package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      // Lire README.md si disponible
      let description = packageJson.description || '';
      try {
        const readmePath = path.join(projectPath, 'README.md');
        const readme = await fs.readFile(readmePath, 'utf-8');
        const firstLine = readme.split('\n')[0];
        if (firstLine && !firstLine.startsWith('#')) {
          description = firstLine;
        }
      } catch {
        // README.md non trouvé, utiliser la description du package.json
      }

      return {
        name: packageJson.name || 'angular-migration-project',
        version: packageJson.version || '1.0.0',
        description,
        authors: packageJson.author ? [packageJson.author] : [],
        license: packageJson.license || 'MIT',
        technologies: this.extractTechnologies(packageJson),
        repositories: packageJson.repository ? [packageJson.repository] : []
      };

    } catch (error) {
      this.logger.warn('⚠️ Impossible de lire les métadonnées du projet', error);
      return {
        name: 'angular-migration-project',
        version: '1.0.0',
        description: 'Projet de migration Angular 5 → 20',
        authors: [],
        license: 'MIT',
        technologies: ['Angular', 'TypeScript', 'Node.js'],
        repositories: []
      };
    }
  }

  /**
   * Extrait les technologies utilisées depuis package.json
   *
   * @param packageJson - Contenu du package.json
   * @returns string[] - Liste des technologies
   */
  private extractTechnologies(packageJson: any): string[] {
    const technologies: string[] = [];

    // Technologies principales
    if (packageJson.dependencies) {
      if (packageJson.dependencies['@angular/core']) technologies.push('Angular');
      if (packageJson.dependencies['typescript']) technologies.push('TypeScript');
      if (packageJson.dependencies['rxjs']) technologies.push('RxJS');
      if (packageJson.dependencies['node']) technologies.push('Node.js');
    }

    // Technologies de développement
    if (packageJson.devDependencies) {
      if (packageJson.devDependencies['jest']) technologies.push('Jest');
      if (packageJson.devDependencies['eslint']) technologies.push('ESLint');
      if (packageJson.devDependencies['typescript']) technologies.push('TypeScript');
    }

    return technologies;
  }

  /**
   * Analyse tous les fichiers du projet
   *
   * @param projectPath - Chemin vers le projet
   * @returns Promise<FileMetadata[]> - Liste des métadonnées des fichiers
   */
  private async analyzeFiles(projectPath: string): Promise<FileMetadata[]> {
    this.logger.info('📁 Analyse des fichiers du projet');

    const files: FileMetadata[] = [];
    const filePaths = await this.findFiles(projectPath);

    for (const filePath of filePaths) {
      try {
        const metadata = await this.analyzeFile(filePath, projectPath);
        files.push(metadata);
      } catch (error) {
        this.logger.warn(`⚠️ Impossible d'analyser le fichier: ${filePath}`, error);
      }
    }

    this.logger.info(`✅ ${files.length} fichiers analysés`);
    return files;
  }

  /**
   * Trouve tous les fichiers à analyser
   *
   * @param projectPath - Chemin vers le projet
   * @returns Promise<string[]> - Liste des chemins de fichiers
   */
  private async findFiles(projectPath: string): Promise<string[]> {
    const patterns = this.SUPPORTED_EXTENSIONS.map(ext => `**/*${ext}`);
    const files: string[] = [];

    for (const pattern of patterns) {
      const matches = await glob.glob(pattern, {
        cwd: projectPath,
        ignore: this.IGNORE_PATTERNS,
        absolute: true
      });
      files.push(...matches);
    }

    return [...new Set(files)]; // Supprimer les doublons
  }

  /**
   * Analyse un fichier individuel
   *
   * @param filePath - Chemin absolu du fichier
   * @param projectPath - Chemin du projet (pour le chemin relatif)
   * @returns Promise<FileMetadata> - Métadonnées du fichier
   */
  private async analyzeFile(filePath: string, projectPath: string): Promise<FileMetadata> {
    const relativePath = path.relative(projectPath, filePath);
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const extension = path.extname(filePath);
    const name = path.basename(filePath);

    // Analyser le contenu
    const lines = content.split('\n');
    const linesOfCode = lines.filter(line => line.trim() && !line.trim().startsWith('//')).length;
    const linesOfComments = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*')).length;

    // Déterminer le type de fichier
    const type = this.determineFileType(content, name, extension);
    const language = this.determineLanguage(extension);

    // Extraire les dépendances, imports et exports
    const dependencies = this.extractDependencies(content);
    const imports = this.extractImports(content);
    const exports = this.extractExports(content);

    return {
      path: relativePath,
      name,
      extension,
      size: stats.size,
      lastModified: stats.mtime,
      type,
      language,
      linesOfCode,
      linesOfComments,
      dependencies,
      exports,
      imports
    };
  }

  /**
   * Détermine le type d'un fichier basé sur son contenu
   *
   * @param content - Contenu du fichier
   * @param name - Nom du fichier
   * @param extension - Extension du fichier
   * @returns FileType - Type du fichier
   */
  private determineFileType(content: string, name: string, extension: string): FileType {
    // Fichiers de configuration
    if (name.includes('config') || name.includes('Config')) {
      return FileType.CONFIG;
    }

    // Fichiers de test
    if (name.includes('.test.') || name.includes('.spec.') || name.includes('test')) {
      return FileType.TEST;
    }

    // Fichiers de documentation
    if (extension === '.md' || name.includes('README') || name.includes('CHANGELOG')) {
      return FileType.DOCUMENTATION;
    }

    // Fichiers TypeScript/JavaScript
    if (extension === '.ts' || extension === '.js') {
      // Composants Angular
      if (content.includes('@Component') || content.includes('Component')) {
        return FileType.COMPONENT;
      }

      // Services Angular
      if (content.includes('@Injectable') || content.includes('Service')) {
        return FileType.SERVICE;
      }

      // Modules Angular
      if (content.includes('@NgModule') || content.includes('Module')) {
        return FileType.MODULE;
      }

      // Interfaces
      if (content.includes('interface ') || content.includes('Interface')) {
        return FileType.INTERFACE;
      }

      // Types
      if (content.includes('type ') || content.includes('Type')) {
        return FileType.TYPE;
      }

      // Enums
      if (content.includes('enum ') || content.includes('Enum')) {
        return FileType.ENUM;
      }

      // Classes
      if (content.includes('class ') || content.includes('Class')) {
        return FileType.CLASS;
      }

      // Fonctions
      if (content.includes('function ') || content.includes('const ') || content.includes('export ')) {
        return FileType.FUNCTION;
      }

      // Utilitaires
      if (name.includes('util') || name.includes('helper') || name.includes('common')) {
        return FileType.UTILITY;
      }
    }

    // Scripts
    if (name.includes('script') || name.includes('build') || name.includes('migrate')) {
      return FileType.SCRIPT;
    }

    return FileType.OTHER;
  }

  /**
   * Détermine le langage de programmation basé sur l'extension
   *
   * @param extension - Extension du fichier
   * @returns string - Langage de programmation
   */
  private determineLanguage(extension: string): string {
    const languageMap: Record<string, string> = {
      '.ts': 'TypeScript',
      '.js': 'JavaScript',
      '.json': 'JSON',
      '.md': 'Markdown',
      '.yml': 'YAML',
      '.yaml': 'YAML',
      '.html': 'HTML',
      '.css': 'CSS',
      '.scss': 'SCSS',
      '.sass': 'Sass',
      '.less': 'Less'
    };

    return languageMap[extension] || 'Unknown';
  }

  /**
   * Extrait les dépendances d'un fichier
   *
   * @param content - Contenu du fichier
   * @returns string[] - Liste des dépendances
   */
  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];

    // Imports ES6
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    // Requires CommonJS
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    return [...new Set(dependencies)]; // Supprimer les doublons
  }

  /**
   * Extrait les imports d'un fichier
   *
   * @param content - Contenu du fichier
   * @returns string[] - Liste des imports
   */
  private extractImports(content: string): string[] {
    const imports: string[] = [];

    // Imports ES6
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return [...new Set(imports)]; // Supprimer les doublons
  }

  /**
   * Extrait les exports d'un fichier
   *
   * @param content - Contenu du fichier
   * @returns string[] - Liste des exports
   */
  private extractExports(content: string): string[] {
    const exports: string[] = [];

    // Exports nommés
    const namedExportRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    // Exports par défaut
    const defaultExportRegex = /export\s+default\s+(?:class|function|const|let|var)\s+(\w+)/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    return [...new Set(exports)]; // Supprimer les doublons
  }

  /**
   * Extrait la documentation API des fichiers
   *
   * @param files - Liste des fichiers analysés
   * @returns Promise<APIDocumentation> - Documentation API
   */
  private async extractAPIDocumentation(files: FileMetadata[]): Promise<APIDocumentation> {
    this.logger.info('📚 Extraction de la documentation API');

    const api: APIDocumentation = {
      classes: [],
      interfaces: [],
      functions: [],
      types: [],
      enums: []
    };

    for (const file of files) {
      if (file.extension === '.ts' || file.extension === '.js') {
        try {
          const content = await fs.readFile(file.path, 'utf-8');
          const jsdocComments = this.extractJSDocComments(content);

          // Analyser les classes
          const classes = this.extractClasses(content, jsdocComments, file.path);
          api.classes.push(...classes);

          // Analyser les interfaces
          const interfaces = this.extractInterfaces(content, jsdocComments, file.path);
          api.interfaces.push(...interfaces);

          // Analyser les fonctions
          const functions = this.extractFunctions(content, jsdocComments, file.path);
          api.functions.push(...functions);

          // Analyser les types
          const types = this.extractTypes(content, jsdocComments, file.path);
          api.types.push(...types);

          // Analyser les enums
          const enums = this.extractEnums(content, jsdocComments, file.path);
          api.enums.push(...enums);

        } catch (error) {
          this.logger.warn(`⚠️ Impossible d'extraire la documentation API de: ${file.path}`, error);
        }
      }
    }

    this.logger.info(`✅ Documentation API extraite: ${api.classes.length} classes, ${api.interfaces.length} interfaces, ${api.functions.length} fonctions`);
    return api;
  }

  /**
   * Extrait les commentaires JSDoc d'un fichier
   *
   * @param content - Contenu du fichier
   * @returns JSDocComment[] - Liste des commentaires JSDoc
   */
  private extractJSDocComments(content: string): JSDocComment[] {
    const comments: JSDocComment[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('/**')) {
        const comment = this.parseJSDocComment(lines, i);
        if (comment) {
          comments.push(comment);
        }
      }
    }

    return comments;
  }

  /**
   * Parse un commentaire JSDoc
   *
   * @param lines - Lignes du fichier
   * @param startIndex - Index de début du commentaire
   * @returns JSDocComment | null - Commentaire JSDoc parsé
   */
  private parseJSDocComment(lines: string[], startIndex: number): JSDocComment | null {
    const comment: JSDocComment = {
      description: '',
      tags: [],
      startLine: startIndex + 1,
      endLine: startIndex + 1,
      elementType: '',
      elementName: ''
    };

    let currentLine = startIndex;
    let descriptionLines: string[] = [];
    let inDescription = true;

    // Lire le commentaire
    while (currentLine < lines.length) {
      const line = lines[currentLine];

      if (line.trim() === '*/') {
        comment.endLine = currentLine + 1;
        break;
      }

      if (line.trim().startsWith('*')) {
        const content = line.trim().substring(1).trim();

        if (content.startsWith('@')) {
          inDescription = false;
          const tag = this.parseJSDocTag(content);
          if (tag) {
            comment.tags.push(tag);
          }
        } else if (inDescription && content) {
          descriptionLines.push(content);
        }
      }

      currentLine++;
    }

    comment.description = descriptionLines.join(' ');

    // Déterminer l'élément documenté
    const nextLine = lines[comment.endLine];
    if (nextLine) {
      const elementInfo = this.parseElementInfo(nextLine);
      comment.elementType = elementInfo.type;
      comment.elementName = elementInfo.name;
    }

    return comment;
  }

  /**
   * Parse un tag JSDoc
   *
   * @param content - Contenu du tag
   * @returns JSDocTag | null - Tag JSDoc parsé
   */
  private parseJSDocTag(content: string): JSDocTag | null {
    const parts = content.split(' ');
    if (parts.length < 2) return null;

    const name = parts[0];
    const rest = parts.slice(1).join(' ');

    const tag: JSDocTag = {
      name,
      description: rest
    };

    // Parser les tags spécifiques
    switch (name) {
      case '@param':
        const paramMatch = rest.match(/^\{([^}]+)\}\s+(\w+)\s+(.*)/);
        if (paramMatch) {
          tag.type = paramMatch[1];
          tag.parameterName = paramMatch[2];
          tag.description = paramMatch[3];
        }
        break;

      case '@returns':
      case '@return':
        const returnMatch = rest.match(/^\{([^}]+)\}\s+(.*)/);
        if (returnMatch) {
          tag.type = returnMatch[1];
          tag.description = returnMatch[2];
        }
        break;

      case '@example':
        tag.example = rest;
        break;
    }

    return tag;
  }

  /**
   * Parse les informations d'un élément (classe, fonction, etc.)
   *
   * @param line - Ligne contenant l'élément
   * @returns {type: string, name: string} - Type et nom de l'élément
   */
  private parseElementInfo(line: string): {type: string, name: string} {
    const trimmed = line.trim();

    // Classe
    const classMatch = trimmed.match(/^(?:export\s+)?(?:public\s+|private\s+|protected\s+)?class\s+(\w+)/);
    if (classMatch) {
      return { type: 'class', name: classMatch[1] };
    }

    // Interface
    const interfaceMatch = trimmed.match(/^(?:export\s+)?interface\s+(\w+)/);
    if (interfaceMatch) {
      return { type: 'interface', name: interfaceMatch[1] };
    }

    // Fonction
    const functionMatch = trimmed.match(/^(?:export\s+)?(?:public\s+|private\s+|protected\s+)?(?:async\s+)?function\s+(\w+)/);
    if (functionMatch) {
      return { type: 'function', name: functionMatch[1] };
    }

    // Constante/Fonction fléchée
    const constMatch = trimmed.match(/^(?:export\s+)?(?:const|let|var)\s+(\w+)/);
    if (constMatch) {
      return { type: 'const', name: constMatch[1] };
    }

    // Type
    const typeMatch = trimmed.match(/^(?:export\s+)?type\s+(\w+)/);
    if (typeMatch) {
      return { type: 'type', name: typeMatch[1] };
    }

    // Enum
    const enumMatch = trimmed.match(/^(?:export\s+)?enum\s+(\w+)/);
    if (enumMatch) {
      return { type: 'enum', name: enumMatch[1] };
    }

    return { type: 'unknown', name: 'unknown' };
  }

  /**
   * Extrait les classes d'un fichier
   *
   * @param content - Contenu du fichier
   * @param jsdocComments - Commentaires JSDoc
   * @param filePath - Chemin du fichier
   * @returns ClassDocumentation[] - Documentation des classes
   */
  private extractClasses(content: string, jsdocComments: JSDocComment[], filePath: string): ClassDocumentation[] {
    const classes: ClassDocumentation[] = [];
    const classRegex = /^(?:export\s+)?(?:public\s+|private\s+|protected\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?/gm;

    let match;
    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      const extendsClass = match[2];
      const implementsClasses = match[3] ? match[3].split(',').map(s => s.trim()) : [];

      // Trouver le commentaire JSDoc associé
      const jsdoc = jsdocComments.find(c => c.elementName === className && c.elementType === 'class');

      const classDoc: ClassDocumentation = {
        name: className,
        description: jsdoc?.description || '',
        file: filePath,
        startLine: 0, // À implémenter
        endLine: 0, // À implémenter
        methods: [], // À implémenter
        properties: [], // À implémenter
        extends: extendsClass,
        implements: implementsClasses,
        modifiers: [], // À implémenter
        tags: jsdoc?.tags || []
      };

      classes.push(classDoc);
    }

    return classes;
  }

  /**
   * Extrait les interfaces d'un fichier
   *
   * @param content - Contenu du fichier
   * @param jsdocComments - Commentaires JSDoc
   * @param filePath - Chemin du fichier
   * @returns InterfaceDocumentation[] - Documentation des interfaces
   */
  private extractInterfaces(content: string, jsdocComments: JSDocComment[], filePath: string): InterfaceDocumentation[] {
    const interfaces: InterfaceDocumentation[] = [];
    const interfaceRegex = /^(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+([^{]+))?/gm;

    let match;
    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceName = match[1];
      const extendsInterfaces = match[2] ? match[2].split(',').map(s => s.trim()) : [];

      // Trouver le commentaire JSDoc associé
      const jsdoc = jsdocComments.find(c => c.elementName === interfaceName && c.elementType === 'interface');

      const interfaceDoc: InterfaceDocumentation = {
        name: interfaceName,
        description: jsdoc?.description || '',
        file: filePath,
        properties: [], // À implémenter
        methods: [], // À implémenter
        extends: extendsInterfaces,
        tags: jsdoc?.tags || []
      };

      interfaces.push(interfaceDoc);
    }

    return interfaces;
  }

  /**
   * Extrait les fonctions d'un fichier
   *
   * @param content - Contenu du fichier
   * @param jsdocComments - Commentaires JSDoc
   * @param filePath - Chemin du fichier
   * @returns FunctionDocumentation[] - Documentation des fonctions
   */
  private extractFunctions(content: string, jsdocComments: JSDocComment[], filePath: string): FunctionDocumentation[] {
    const functions: FunctionDocumentation[] = [];
    const functionRegex = /^(?:export\s+)?(?:public\s+|private\s+|protected\s+)?(?:async\s+)?function\s+(\w+)\s*\(/gm;

    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];

      // Trouver le commentaire JSDoc associé
      const jsdoc = jsdocComments.find(c => c.elementName === functionName && c.elementType === 'function');

      const functionDoc: FunctionDocumentation = {
        name: functionName,
        description: jsdoc?.description || '',
        file: filePath,
        parameters: [], // À implémenter
        returnType: 'any', // À implémenter
        returnDescription: '', // À implémenter
        modifiers: [], // À implémenter
        tags: jsdoc?.tags || [],
        examples: [] // À implémenter
      };

      functions.push(functionDoc);
    }

    return functions;
  }

  /**
   * Extrait les types d'un fichier
   *
   * @param content - Contenu du fichier
   * @param jsdocComments - Commentaires JSDoc
   * @param filePath - Chemin du fichier
   * @returns TypeDocumentation[] - Documentation des types
   */
  private extractTypes(content: string, jsdocComments: JSDocComment[], filePath: string): TypeDocumentation[] {
    const types: TypeDocumentation[] = [];
    const typeRegex = /^(?:export\s+)?type\s+(\w+)\s*=/gm;

    let match;
    while ((match = typeRegex.exec(content)) !== null) {
      const typeName = match[1];

      // Trouver le commentaire JSDoc associé
      const jsdoc = jsdocComments.find(c => c.elementName === typeName && c.elementType === 'type');

      const typeDoc: TypeDocumentation = {
        name: typeName,
        description: jsdoc?.description || '',
        file: filePath,
        definition: '', // À implémenter
        tags: jsdoc?.tags || []
      };

      types.push(typeDoc);
    }

    return types;
  }

  /**
   * Extrait les enums d'un fichier
   *
   * @param content - Contenu du fichier
   * @param jsdocComments - Commentaires JSDoc
   * @param filePath - Chemin du fichier
   * @returns EnumDocumentation[] - Documentation des enums
   */
  private extractEnums(content: string, jsdocComments: JSDocComment[], filePath: string): EnumDocumentation[] {
    const enums: EnumDocumentation[] = [];
    const enumRegex = /^(?:export\s+)?enum\s+(\w+)/gm;

    let match;
    while ((match = enumRegex.exec(content)) !== null) {
      const enumName = match[1];

      // Trouver le commentaire JSDoc associé
      const jsdoc = jsdocComments.find(c => c.elementName === enumName && c.elementType === 'enum');

      const enumDoc: EnumDocumentation = {
        name: enumName,
        description: jsdoc?.description || '',
        file: filePath,
        values: [], // À implémenter
        tags: jsdoc?.tags || []
      };

      enums.push(enumDoc);
    }

    return enums;
  }

  /**
   * Calcule les statistiques du projet
   *
   * @param files - Liste des fichiers analysés
   * @returns Promise<ProjectStatistics> - Statistiques du projet
   */
  private async calculateStatistics(files: FileMetadata[]): Promise<ProjectStatistics> {
    this.logger.info('📊 Calcul des statistiques du projet');

    const totalFiles = files.length;
    const totalLinesOfCode = files.reduce((sum, file) => sum + file.linesOfCode, 0);
    const totalLinesOfComments = files.reduce((sum, file) => sum + file.linesOfComments, 0);
    const commentRatio = totalLinesOfCode > 0 ? (totalLinesOfComments / totalLinesOfCode) * 100 : 0;

    // Répartition par type de fichier
    const fileTypeDistribution: Record<string, number> = {};
    files.forEach(file => {
      fileTypeDistribution[file.type] = (fileTypeDistribution[file.type] || 0) + 1;
    });

    // Répartition par langage
    const languageDistribution: Record<string, number> = {};
    files.forEach(file => {
      languageDistribution[file.language] = (languageDistribution[file.language] || 0) + 1;
    });

    // Taille moyenne des fichiers
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0;

    // Fichiers les plus volumineux
    const largestFiles = files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
      .map(file => ({
        file: file.path,
        size: file.size,
        lines: file.linesOfCode
      }));

    // Fichiers les plus complexes (basé sur le nombre de lignes pour l'instant)
    const mostComplexFiles = files
      .sort((a, b) => b.linesOfCode - a.linesOfCode)
      .slice(0, 10)
      .map(file => ({
        file: file.path,
        complexity: file.linesOfCode, // Approximation
        lines: file.linesOfCode
      }));

    return {
      totalFiles,
      totalLinesOfCode,
      totalLinesOfComments,
      commentRatio,
      averageComplexity: 0, // À implémenter
      fileTypeDistribution,
      languageDistribution,
      averageFileSize,
      mostComplexFiles,
      largestFiles
    };
  }

  /**
   * Génère des recommandations d'amélioration
   *
   * @param files - Liste des fichiers analysés
   * @param statistics - Statistiques du projet
   * @returns Promise<string[]> - Liste des recommandations
   */
  private async generateRecommendations(files: FileMetadata[], statistics: ProjectStatistics): Promise<string[]> {
    const recommendations: string[] = [];

    // Recommandations basées sur le taux de commentaires
    if (statistics.commentRatio < 10) {
      recommendations.push('📝 Taux de commentaires faible (< 10%). Considérez ajouter plus de documentation JSDoc.');
    } else if (statistics.commentRatio > 50) {
      recommendations.push('📝 Taux de commentaires élevé (> 50%). Vérifiez que les commentaires sont pertinents.');
    }

    // Recommandations basées sur la taille des fichiers
    const largeFiles = files.filter(file => file.linesOfCode > 500);
    if (largeFiles.length > 0) {
      recommendations.push(`📏 ${largeFiles.length} fichier(s) très volumineux (> 500 lignes). Considérez les diviser.`);
    }

    // Recommandations basées sur les types de fichiers
    if (statistics.fileTypeDistribution[FileType.TEST] < statistics.fileTypeDistribution[FileType.COMPONENT]) {
      recommendations.push('🧪 Nombre de fichiers de test insuffisant. Ajoutez plus de tests unitaires.');
    }

    // Recommandations basées sur les technologies
    if (statistics.languageDistribution['TypeScript'] > 0 && statistics.languageDistribution['JavaScript'] > 0) {
      recommendations.push('🔄 Mélange TypeScript/JavaScript détecté. Considérez migrer vers TypeScript uniquement.');
    }

    return recommendations;
  }

  /**
   * Génère la documentation HTML
   *
   * @param documentation - Documentation générée
   * @param outputPath - Chemin de sortie
   * @returns Promise<string> - Chemin vers le fichier HTML
   */
  private async generateHTMLDocumentation(documentation: GeneratedDocumentation, outputPath: string): Promise<string> {
    const htmlContent = this.createHTMLContent(documentation);
    const filePath = path.join(outputPath, 'index.html');
    await fs.writeFile(filePath, htmlContent, 'utf-8');
    return filePath;
  }

  /**
   * Génère la documentation Markdown
   *
   * @param documentation - Documentation générée
   * @param outputPath - Chemin de sortie
   * @returns Promise<string> - Chemin vers le fichier Markdown
   */
  private async generateMarkdownDocumentation(documentation: GeneratedDocumentation, outputPath: string): Promise<string> {
    const mdContent = this.createMarkdownContent(documentation);
    const filePath = path.join(outputPath, 'README.md');
    await fs.writeFile(filePath, mdContent, 'utf-8');
    return filePath;
  }

  /**
   * Génère la documentation JSON
   *
   * @param documentation - Documentation générée
   * @param outputPath - Chemin de sortie
   * @returns Promise<string> - Chemin vers le fichier JSON
   */
  private async generateJSONDocumentation(documentation: GeneratedDocumentation, outputPath: string): Promise<string> {
    const filePath = path.join(outputPath, 'documentation.json');
    await fs.writeFile(filePath, JSON.stringify(documentation, null, 2), 'utf-8');
    return filePath;
  }

  /**
   * Génère la documentation par phase
   *
   * @param projectPath - Chemin du projet
   * @param outputPath - Chemin de sortie
   * @returns Promise<string[]> - Chemins vers les fichiers de documentation
   */
  private async generatePhaseDocumentation(projectPath: string, outputPath: string): Promise<string[]> {
    const phasePaths = [
      'phase-1-angular-5-to-8',
      'phase-2-angular-8-to-12',
      'phase-3-angular-12-to-16',
      'phase-4-angular-16-to-20'
    ];

    const generatedFiles: string[] = [];

    for (const phasePath of phasePaths) {
      const fullPhasePath = path.join(projectPath, phasePath);
      try {
        await fs.access(fullPhasePath);

        const phaseFiles = await this.analyzeFiles(fullPhasePath);
        const phaseApi = await this.extractAPIDocumentation(phaseFiles);
        const phaseStats = await this.calculateStatistics(phaseFiles);

        const phaseDoc = {
          phase: phasePath,
          files: phaseFiles,
          api: phaseApi,
          statistics: phaseStats,
          generatedAt: new Date()
        };

        const mdContent = this.createPhaseMarkdownContent(phaseDoc);
        const filePath = path.join(outputPath, `${phasePath}.md`);
        await fs.writeFile(filePath, mdContent, 'utf-8');
        generatedFiles.push(filePath);

      } catch (error) {
        this.logger.warn(`⚠️ Phase non trouvée: ${phasePath}`, error);
      }
    }

    return generatedFiles;
  }

  /**
   * Génère les diagrammes
   *
   * @param documentation - Documentation générée
   * @param outputPath - Chemin de sortie
   * @returns Promise<string[]> - Chemins vers les fichiers de diagrammes
   */
  private async generateDiagrams(documentation: GeneratedDocumentation, outputPath: string): Promise<string[]> {
    const generatedFiles: string[] = [];

    // Diagramme d'architecture
    const architectureDiagram = this.createArchitectureDiagram(documentation);
    const archPath = path.join(outputPath, 'architecture.mermaid');
    await fs.writeFile(archPath, architectureDiagram, 'utf-8');
    generatedFiles.push(archPath);

    // Diagramme de dépendances
    const dependencyDiagram = this.createDependencyDiagram(documentation);
    const depPath = path.join(outputPath, 'dependencies.mermaid');
    await fs.writeFile(depPath, dependencyDiagram, 'utf-8');
    generatedFiles.push(depPath);

    return generatedFiles;
  }

  /**
   * Crée le contenu HTML
   *
   * @param documentation - Documentation générée
   * @returns string - Contenu HTML
   */
  private createHTMLContent(documentation: GeneratedDocumentation): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation - ${documentation.project.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin: 20px 0; }
        .api-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .code { background: #f4f4f4; padding: 10px; border-radius: 3px; font-family: monospace; }
        .recommendation { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Documentation - ${documentation.project.name}</h1>
        <p><strong>Version:</strong> ${documentation.project.version}</p>
        <p><strong>Description:</strong> ${documentation.project.description}</p>
        <p><strong>Généré le:</strong> ${documentation.generatedAt.toLocaleString('fr-FR')}</p>
    </div>

    <div class="section">
        <h2>📊 Statistiques du Projet</h2>
        <div class="stats">
            <div class="stat-card">
                <h3>Fichiers</h3>
                <p>${documentation.statistics.totalFiles}</p>
            </div>
            <div class="stat-card">
                <h3>Lignes de Code</h3>
                <p>${documentation.statistics.totalLinesOfCode.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Commentaires</h3>
                <p>${documentation.statistics.totalLinesOfComments.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Taux de Commentaires</h3>
                <p>${documentation.statistics.commentRatio.toFixed(1)}%</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🏗️ Architecture</h2>
        <div class="code">
            ${this.createArchitectureText(documentation)}
        </div>
    </div>

    <div class="section">
        <h2>📚 API Documentation</h2>
        ${this.createAPIContent(documentation.api)}
    </div>

    <div class="section">
        <h2>💡 Recommandations</h2>
        ${documentation.recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
    </div>

    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
        <p>Documentation générée automatiquement par DocumentationGenerator</p>
    </footer>
</body>
</html>`;
  }

  /**
   * Crée le contenu Markdown
   *
   * @param documentation - Documentation générée
   * @returns string - Contenu Markdown
   */
  private createMarkdownContent(documentation: GeneratedDocumentation): string {
    return `# 📚 Documentation - ${documentation.project.name}

**Version:** ${documentation.project.version}
**Description:** ${documentation.project.description}
**Généré le:** ${documentation.generatedAt.toLocaleString('fr-FR')}

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| Fichiers | ${documentation.statistics.totalFiles} |
| Lignes de Code | ${documentation.statistics.totalLinesOfCode.toLocaleString()} |
| Commentaires | ${documentation.statistics.totalLinesOfComments.toLocaleString()} |
| Taux de Commentaires | ${documentation.statistics.commentRatio.toFixed(1)}% |

## 🏗️ Architecture

\`\`\`
${this.createArchitectureText(documentation)}
\`\`\`

## 📚 API Documentation

${this.createAPIMarkdownContent(documentation.api)}

## 💡 Recommandations

${documentation.recommendations.map(rec => `- ${rec}`).join('\n')}

---

*Documentation générée automatiquement par DocumentationGenerator*
`;
  }

  /**
   * Crée le contenu Markdown pour une phase
   *
   * @param phaseDoc - Documentation de la phase
   * @returns string - Contenu Markdown
   */
  private createPhaseMarkdownContent(phaseDoc: any): string {
    return `# 📚 Documentation - ${phaseDoc.phase}

**Généré le:** ${phaseDoc.generatedAt.toLocaleString('fr-FR')}

## 📊 Statistiques de la Phase

| Métrique | Valeur |
|----------|--------|
| Fichiers | ${phaseDoc.statistics.totalFiles} |
| Lignes de Code | ${phaseDoc.statistics.totalLinesOfCode.toLocaleString()} |
| Commentaires | ${phaseDoc.statistics.totalLinesOfComments.toLocaleString()} |
| Taux de Commentaires | ${phaseDoc.statistics.commentRatio.toFixed(1)}% |

## 📁 Fichiers

${phaseDoc.files.map((file: any) => `- **${file.name}** (${file.type}) - ${file.linesOfCode} lignes`).join('\n')}

## 📚 API

### Classes (${phaseDoc.api.classes.length})
${phaseDoc.api.classes.map((cls: any) => `- **${cls.name}** - ${cls.description}`).join('\n')}

### Interfaces (${phaseDoc.api.interfaces.length})
${phaseDoc.api.interfaces.map((intf: any) => `- **${intf.name}** - ${intf.description}`).join('\n')}

### Fonctions (${phaseDoc.api.functions.length})
${phaseDoc.api.functions.map((fn: any) => `- **${fn.name}** - ${fn.description}`).join('\n')}

---

*Documentation générée automatiquement par DocumentationGenerator*
`;
  }

  /**
   * Crée le texte d'architecture
   *
   * @param documentation - Documentation générée
   * @returns string - Texte d'architecture
   */
  private createArchitectureText(documentation: GeneratedDocumentation): string {
    const phases = ['phase-1-angular-5-to-8', 'phase-2-angular-8-to-12', 'phase-3-angular-12-to-16', 'phase-4-angular-16-to-20'];

    return `
Migration Angular 5 → 20
├── Phase 1: Angular 5 → 8 (Critique)
├── Phase 2: Angular 8 → 12 (Stabilisation)
├── Phase 3: Angular 12 → 16 (Modernisation)
└── Phase 4: Angular 16 → 20 (Révolution)

Technologies: ${documentation.project.technologies.join(', ')}
Fichiers: ${documentation.statistics.totalFiles}
Lignes de code: ${documentation.statistics.totalLinesOfCode.toLocaleString()}
`;
  }

  /**
   * Crée le contenu API HTML
   *
   * @param api - Documentation API
   * @returns string - Contenu HTML
   */
  private createAPIContent(api: APIDocumentation): string {
    let content = '';

    if (api.classes.length > 0) {
      content += '<h3>Classes</h3>';
      api.classes.forEach(cls => {
        content += `
          <div class="api-item">
            <h4>${cls.name}</h4>
            <p>${cls.description}</p>
            <p><strong>Fichier:</strong> ${cls.file}</p>
            ${cls.extends ? `<p><strong>Hérite de:</strong> ${cls.extends}</p>` : ''}
            ${cls.implements.length > 0 ? `<p><strong>Implémente:</strong> ${cls.implements.join(', ')}</p>` : ''}
          </div>
        `;
      });
    }

    if (api.interfaces.length > 0) {
      content += '<h3>Interfaces</h3>';
      api.interfaces.forEach(intf => {
        content += `
          <div class="api-item">
            <h4>${intf.name}</h4>
            <p>${intf.description}</p>
            <p><strong>Fichier:</strong> ${intf.file}</p>
          </div>
        `;
      });
    }

    if (api.functions.length > 0) {
      content += '<h3>Fonctions</h3>';
      api.functions.forEach(fn => {
        content += `
          <div class="api-item">
            <h4>${fn.name}</h4>
            <p>${fn.description}</p>
            <p><strong>Fichier:</strong> ${fn.file}</p>
            <p><strong>Retourne:</strong> ${fn.returnType}</p>
          </div>
        `;
      });
    }

    return content;
  }

  /**
   * Crée le contenu API Markdown
   *
   * @param api - Documentation API
   * @returns string - Contenu Markdown
   */
  private createAPIMarkdownContent(api: APIDocumentation): string {
    let content = '';

    if (api.classes.length > 0) {
      content += '### Classes\n\n';
      api.classes.forEach(cls => {
        content += `#### ${cls.name}\n\n`;
        content += `${cls.description}\n\n`;
        content += `**Fichier:** ${cls.file}\n\n`;
        if (cls.extends) content += `**Hérite de:** ${cls.extends}\n\n`;
        if (cls.implements.length > 0) content += `**Implémente:** ${cls.implements.join(', ')}\n\n`;
      });
    }

    if (api.interfaces.length > 0) {
      content += '### Interfaces\n\n';
      api.interfaces.forEach(intf => {
        content += `#### ${intf.name}\n\n`;
        content += `${intf.description}\n\n`;
        content += `**Fichier:** ${intf.file}\n\n`;
      });
    }

    if (api.functions.length > 0) {
      content += '### Fonctions\n\n';
      api.functions.forEach(fn => {
        content += `#### ${fn.name}\n\n`;
        content += `${fn.description}\n\n`;
        content += `**Fichier:** ${fn.file}\n\n`;
        content += `**Retourne:** ${fn.returnType}\n\n`;
      });
    }

    return content;
  }

  /**
   * Crée le diagramme d'architecture Mermaid
   *
   * @param documentation - Documentation générée
   * @returns string - Diagramme Mermaid
   */
  private createArchitectureDiagram(documentation: GeneratedDocumentation): string {
    return `
graph TD
    A[Angular 5] --> B[Phase 1: Angular 8]
    B --> C[Phase 2: Angular 12]
    C --> D[Phase 3: Angular 16]
    D --> E[Angular 20]

    B --> B1[RxJS 6+]
    B --> B2[TypeScript 3.4+]
    B --> B3[HttpClient]

    C --> C1[Ivy Renderer]
    C --> C2[Webpack 5]
    C --> C3[Optimisations]

    D --> D1[Standalone Components]
    D --> D2[inject Function]
    D --> D3[Signals]
    D --> D4[Typed Forms]

    E --> E1[Control Flow]
    E --> E2[Signals Avancés]
    E --> E3[Zoneless]
    E --> E4[Standalone Obligatoire]

    F[Java Spring Boot] --> G[Backend Integration]
    G --> H[Protractor/Cypress]
    G --> I[Jenkins CI/CD]
    G --> J[SDK]
`;
  }

  /**
   * Crée le diagramme de dépendances Mermaid
   *
   * @param documentation - Documentation générée
   * @returns string - Diagramme Mermaid
   */
  private createDependencyDiagram(documentation: GeneratedDocumentation): string {
    const dependencies = new Set<string>();

    documentation.files.forEach(file => {
      file.dependencies.forEach(dep => dependencies.add(dep));
    });

    let diagram = 'graph LR\n';
    dependencies.forEach(dep => {
      diagram += `    ${dep.replace(/[^a-zA-Z0-9]/g, '_')}[${dep}]\n`;
    });

    return diagram;
  }

  /**
   * S'assure que le dossier existe
   *
   * @param dirPath - Chemin du dossier
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}

/**
 * Options de génération de documentation
 */
interface DocumentationOptions {
  /** Formats de sortie */
  formats?: ('html' | 'markdown' | 'json')[];
  /** Inclure la documentation par phase */
  includePhases?: boolean;
  /** Inclure les diagrammes */
  includeDiagrams?: boolean;
  /** Niveau de détail */
  detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}
