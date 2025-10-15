import { AnalyzedFile, Transformation, TransformationType, TransformationStatus, MigrationOptions, FileType } from '../types';
import { Logger } from '../utils/Logger';

/**
 * Transformateur de modernisation Angular
 * Applique les transformations pour migrer vers les standards modernes d'Angular 20
 */
export class ModernizationTransformer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Transforme un fichier selon les bonnes pratiques modernes
   */
  async transformFile(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];

    try {
      switch (file.type) {
        case FileType.COMPONENT:
          transformations.push(...await this.transformComponent(file, options));
          break;
        case FileType.SERVICE:
          transformations.push(...await this.transformService(file, options));
          break;
        case FileType.MODULE:
          transformations.push(...await this.transformModule(file, options));
          break;
        case FileType.HTML_TEMPLATE:
          transformations.push(...await this.transformTemplate(file, options));
          break;
        case FileType.PACKAGE_JSON:
          transformations.push(...await this.transformPackageJson(file, options));
          break;
      }

      return transformations;
    } catch (error) {
      this.logger.error(`Erreur lors de la transformation de ${file.path}: ${error.message}`);
      return [];
    }
  }

  /**
   * Transforme un composant vers les standards modernes
   */
  private async transformComponent(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    let content = file.content;

    // 1. Conversion vers standalone
    if (content.includes('@Component') && !content.includes('standalone: true')) {
      const standaloneTransformation = this.convertToStandalone(content);
      if (standaloneTransformation) {
        transformations.push(standaloneTransformation);
        content = standaloneTransformation.after;
      }
    }

    // 2. Migration vers inject()
    const injectTransformation = this.migrateToInject(content);
    if (injectTransformation) {
      transformations.push(injectTransformation);
      content = injectTransformation.after;
    }

    // 3. Migration des formulaires typés
    const typedFormsTransformation = this.migrateToTypedForms(content);
    if (typedFormsTransformation) {
      transformations.push(typedFormsTransformation);
      content = typedFormsTransformation.after;
    }

    // 4. Mise à jour des imports
    const importsTransformation = this.updateImports(content);
    if (importsTransformation) {
      transformations.push(importsTransformation);
      content = importsTransformation.after;
    }

    return transformations;
  }

  /**
   * Transforme un service vers les standards modernes
   */
  private async transformService(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    let content = file.content;

    // 1. Migration vers inject()
    const injectTransformation = this.migrateToInject(content);
    if (injectTransformation) {
      transformations.push(injectTransformation);
      content = injectTransformation.after;
    }

    // 2. Configuration standalone
    if (content.includes('@Injectable') && !content.includes('providedIn: \'root\'')) {
      const standaloneTransformation = this.configureStandaloneService(content);
      if (standaloneTransformation) {
        transformations.push(standaloneTransformation);
        content = standaloneTransformation.after;
      }
    }

    return transformations;
  }

  /**
   * Transforme un module (vers standalone)
   */
  private async transformModule(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    
    // Pour les modules, on génère des recommandations plutôt que des transformations automatiques
    const transformation: Transformation = {
      type: TransformationType.REMOVE_NGMODULE,
      description: 'Migration du NgModule vers les composants standalone',
      before: file.content,
      after: file.content, // Pas de transformation automatique
      status: TransformationStatus.PENDING
    };

    transformations.push(transformation);
    return transformations;
  }

  /**
   * Transforme un template HTML
   */
  private async transformTemplate(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    let content = file.content;

    // Migration du contrôle de flux
    const controlFlowTransformation = this.migrateControlFlow(content);
    if (controlFlowTransformation) {
      transformations.push(controlFlowTransformation);
      content = controlFlowTransformation.after;
    }

    return transformations;
  }

  /**
   * Transforme le package.json
   */
  private async transformPackageJson(file: AnalyzedFile, options: MigrationOptions): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    
    try {
      const packageJson = JSON.parse(file.content);
      const updatedPackageJson = { ...packageJson };
      
      // Mise à jour des dépendances Angular
      const angularDependencies = {
        '@angular/core': '^20.0.0',
        '@angular/common': '^20.0.0',
        '@angular/compiler': '^20.0.0',
        '@angular/platform-browser': '^20.0.0',
        '@angular/platform-browser-dynamic': '^20.0.0',
        '@angular/router': '^20.0.0',
        '@angular/forms': '^20.0.0',
        '@angular/cli': '^20.0.0',
        '@angular-devkit/build-angular': '^20.0.0',
        'typescript': '^5.0.0',
        'rxjs': '^7.8.0',
        'zone.js': '^0.14.0'
      };

      // Mise à jour des dépendances
      Object.keys(angularDependencies).forEach(dep => {
        if (updatedPackageJson.dependencies && updatedPackageJson.dependencies[dep]) {
          updatedPackageJson.dependencies[dep] = angularDependencies[dep];
        }
        if (updatedPackageJson.devDependencies && updatedPackageJson.devDependencies[dep]) {
          updatedPackageJson.devDependencies[dep] = angularDependencies[dep];
        }
      });

      // Suppression des dépendances obsolètes
      const obsoleteDeps = ['@angular/http', 'rxjs-compat'];
      obsoleteDeps.forEach(dep => {
        if (updatedPackageJson.dependencies && updatedPackageJson.dependencies[dep]) {
          delete updatedPackageJson.dependencies[dep];
        }
        if (updatedPackageJson.devDependencies && updatedPackageJson.devDependencies[dep]) {
          delete updatedPackageJson.devDependencies[dep];
        }
      });

      const transformation: Transformation = {
        type: TransformationType.UPDATE_DEPENDENCIES,
        description: 'Mise à jour des dépendances Angular vers la version 20',
        before: file.content,
        after: JSON.stringify(updatedPackageJson, null, 2),
        status: TransformationStatus.PENDING
      };

      transformations.push(transformation);
    } catch (error) {
      this.logger.error(`Erreur lors de la transformation du package.json: ${error.message}`);
    }

    return transformations;
  }

  /**
   * Convertit un composant vers standalone
   */
  private convertToStandalone(content: string): Transformation | null {
    const componentRegex = /@Component\s*\(\s*\{([^}]+)\}\s*\)/;
    const match = content.match(componentRegex);
    
    if (!match) return null;

    const componentConfig = match[1];
    if (componentConfig.includes('standalone: true')) return null;

    // Ajouter standalone: true et imports
    const updatedConfig = componentConfig.trim();
    const newConfig = `{
  standalone: true,
  imports: [CommonModule], // TODO: Ajouter les imports nécessaires
  ${updatedConfig}
}`;

    const newContent = content.replace(componentRegex, `@Component(${newConfig})`);

    return {
      type: TransformationType.CONVERT_TO_STANDALONE,
      description: 'Conversion vers composant standalone',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }

  /**
   * Migre vers la fonction inject()
   */
  private migrateToInject(content: string): Transformation | null {
    // Pattern pour détecter l'injection par constructeur
    const constructorPattern = /constructor\s*\(\s*([^)]+)\s*\)/;
    const match = content.match(constructorPattern);
    
    if (!match) return null;

    const injectionParams = match[1];
    if (!injectionParams.includes('private') && !injectionParams.includes('public')) {
      return null;
    }

    // Extraire les services injectés
    const serviceMatches = injectionParams.match(/(\w+):\s*(\w+)/g);
    if (!serviceMatches) return null;

    // Générer le nouveau code avec inject()
    let newContent = content;
    let injectStatements = '';
    let newConstructor = 'constructor() {';

    serviceMatches.forEach(serviceMatch => {
      const [, serviceName, serviceType] = serviceMatch.match(/(\w+):\s*(\w+)/) || [];
      if (serviceName && serviceType) {
        injectStatements += `  private ${serviceName} = inject(${serviceType});\n`;
      }
    });

    newConstructor += '\n  }';
    
    // Remplacer le constructeur
    newContent = newContent.replace(constructorPattern, newConstructor);
    
    // Ajouter les imports inject() si nécessaire
    if (!newContent.includes('import { inject }')) {
      const importMatch = newContent.match(/import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"]/);
      if (importMatch) {
        const imports = importMatch[1];
        newContent = newContent.replace(
          importMatch[0],
          `import { ${imports}, inject } from '@angular/core'`
        );
      } else {
        // Ajouter l'import inject
        const firstImport = newContent.match(/import.*from.*['"]@angular\/core['"]/);
        if (firstImport) {
          newContent = newContent.replace(
            firstImport[0],
            `${firstImport[0]}\nimport { inject } from '@angular/core';`
          );
        }
      }
    }

    // Ajouter les déclarations inject
    const classMatch = newContent.match(/export class \w+\s*\{/);
    if (classMatch) {
      newContent = newContent.replace(
        classMatch[0],
        `${classMatch[0]}\n${injectStatements}`
      );
    }

    return {
      type: TransformationType.REPLACE_INJECT,
      description: 'Migration vers la fonction inject()',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }

  /**
   * Migre vers les formulaires typés
   */
  private migrateToTypedForms(content: string): Transformation | null {
    if (!content.includes('FormGroup') && !content.includes('FormControl')) {
      return null;
    }

    let newContent = content;

    // Remplacer FormGroup() par FormGroup<Interface>()
    newContent = newContent.replace(
      /FormGroup\s*\(\s*\)/g,
      'FormGroup<MyFormInterface>()' // TODO: Générer l'interface automatiquement
    );

    // Remplacer FormControl() par FormControl<Type>()
    newContent = newContent.replace(
      /FormControl\s*\(\s*\)/g,
      'FormControl<string>()'
    );

    if (newContent === content) return null;

    return {
      type: TransformationType.UPDATE_TYPED_FORMS,
      description: 'Migration vers les formulaires typés',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }

  /**
   * Met à jour les imports
   */
  private updateImports(content: string): Transformation | null {
    let newContent = content;

    // Remplacer les imports obsolètes
    const importReplacements = [
      { from: '@angular/http', to: '@angular/common/http' },
      { from: 'rxjs/operators', to: 'rxjs' }
    ];

    let hasChanges = false;
    importReplacements.forEach(({ from, to }) => {
      if (newContent.includes(`from '${from}'`)) {
        newContent = newContent.replace(new RegExp(`from '${from}'`, 'g'), `from '${to}'`);
        hasChanges = true;
      }
      if (newContent.includes(`from "${from}"`)) {
        newContent = newContent.replace(new RegExp(`from "${from}"`, 'g'), `from "${to}"`);
        hasChanges = true;
      }
    });

    if (!hasChanges) return null;

    return {
      type: TransformationType.UPDATE_IMPORTS,
      description: 'Mise à jour des imports obsolètes',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }

  /**
   * Configure un service en standalone
   */
  private configureStandaloneService(content: string): Transformation | null {
    const injectableRegex = /@Injectable\s*\(\s*\{([^}]*)\}\s*\)/;
    const match = content.match(injectableRegex);
    
    if (!match) return null;

    const config = match[1].trim();
    if (config.includes('providedIn: \'root\'')) return null;

    const newConfig = config ? `{\n  providedIn: 'root',\n  ${config}\n}` : `{\n  providedIn: 'root'\n}`;
    const newContent = content.replace(injectableRegex, `@Injectable(${newConfig})`);

    return {
      type: TransformationType.CONVERT_TO_STANDALONE,
      description: 'Configuration du service en standalone',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }

  /**
   * Migre le contrôle de flux dans les templates
   */
  private migrateControlFlow(content: string): Transformation | null {
    let newContent = content;
    let hasChanges = false;

    // Migration *ngIf vers @if
    if (newContent.includes('*ngIf')) {
      newContent = newContent.replace(/\*ngIf="([^"]+)"/g, '@if ($1) {');
      newContent = newContent.replace(/<\/ng-container>/g, '}');
      hasChanges = true;
    }

    // Migration *ngFor vers @for
    if (newContent.includes('*ngFor')) {
      newContent = newContent.replace(
        /\*ngFor="let (\w+) of ([^;]+); let (\w+) = index"/g,
        '@for ($1 of $2; track $1; let $3 = $index) {'
      );
      newContent = newContent.replace(
        /\*ngFor="let (\w+) of ([^;]+)"/g,
        '@for ($1 of $2; track $1) {'
      );
      hasChanges = true;
    }

    if (!hasChanges) return null;

    return {
      type: TransformationType.UPDATE_CONTROL_FLOW,
      description: 'Migration vers le nouveau contrôle de flux',
      before: content,
      after: newContent,
      status: TransformationStatus.PENDING
    };
  }
}
