# 🚀 Outil de Migration Angular 5 → Angular 20

Outil automatisé pour migrer vos projets Angular 5 vers Angular 20, compatible avec tous types de backends (Java, Python, Node.js, .NET, PHP, etc.).

## ✨ Fonctionnalités

- 🔍 **Détection automatique** du type de backend
- 🎯 **Migration ciblée** des composants Angular uniquement
- 📊 **Rapports détaillés** en HTML, JSON et Markdown
- 🔄 **Migration en lot** pour traiter plusieurs projets
- 🎮 **Mode interactif** pour guider la migration
- 🛡️ **Sauvegarde automatique** avant migration
- 📝 **Analyse complète** des patterns Angular 5

## 🏗️ Architecture

```
src/
├── core/                           # Moteur principal
│   ├── MigrationEngine.ts         # Moteur de migration classique
│   └── BackendAgnosticMigrationEngine.ts  # Moteur agnostique du backend
├── analyzers/                      # Analyseurs
│   ├── ProjectAnalyzer.ts         # Analyseur de projet
│   └── Angular5Analyzer.ts       # Analyseur Angular 5
├── transformers/                   # Transformateurs
│   └── ModernizationTransformer.ts # Transformateur de modernisation
├── utils/                         # Utilitaires
│   ├── Logger.ts                  # Système de logging
│   └── ReportGenerator.ts         # Générateur de rapports
├── scripts/                       # Scripts d'automatisation
│   └── BatchMigrationScript.ts    # Script de migration en lot
└── types/                         # Types TypeScript
    └── index.ts                   # Définitions de types
```

## 🚀 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd angular-migration-tool

# Installer les dépendances
npm install

# Compiler le projet
npm run build
```

## 📖 Utilisation

### 1. Migration d'un projet unique

```bash
# Mode analyse (recommandé pour commencer)
npm run migrate -- analyze -p /chemin/vers/projet

# Mode migration complète
npm run migrate -- migrate -p /chemin/vers/projet --auto-apply

# Mode dry-run (simulation)
npm run migrate -- dry-run -p /chemin/vers/projet
```

### 2. Mode interactif

```bash
npm run migrate -- interactive
```

### 3. Migration en lot

```bash
# Migrer tous les projets Angular dans un répertoire
npm run migrate -- batch -d /chemin/vers/repertoire

# Avec filtrage par type de backend
npm run migrate -- batch -d /chemin/vers/repertoire --backend-types Java,Python
```

## 🎯 Types de Backends Supportés

L'outil détecte automatiquement le type de backend et s'adapte :

- ☕ **Java** : Spring Boot, Maven, Gradle
- 🐍 **Python** : Django, Flask, FastAPI
- 🟢 **Node.js** : Express, NestJS, Koa
- 🔷 **.NET** : ASP.NET Core, Web API
- 🐘 **PHP** : Laravel, Symfony
- 🦀 **Rust** : Actix, Rocket
- 🐹 **Go** : Gin, Echo
- 💎 **Ruby** : Rails, Sinatra

## 🔧 Transformations Appliquées

### 1. Composants Standalone
```typescript
// Avant (Angular 5)
@Component({
  selector: 'app-example',
  template: '<h1>{{title}}</h1>'
})
export class ExampleComponent { }

// Après (Angular 20)
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: '<h1>{{title}}</h1>'
})
export class ExampleComponent { }
```

### 2. Fonction inject()
```typescript
// Avant (Angular 5)
constructor(private http: HttpClient) { }

// Après (Angular 20)
private http = inject(HttpClient);
```

### 3. Nouveau Contrôle de Flux
```html
<!-- Avant (Angular 5) -->
<div *ngIf="isVisible">Contenu</div>
<li *ngFor="let item of items">{{item.name}}</li>

<!-- Après (Angular 20) -->
@if (isVisible) {
  <div>Contenu</div>
}
@for (item of items; track item.id) {
  <li>{{item.name}}</li>
}
```

### 4. Formulaires Typés
```typescript
// Avant (Angular 5)
form = new FormGroup({
  name: new FormControl(''),
  email: new FormControl('')
});

// Après (Angular 20)
interface UserForm {
  name: string;
  email: string;
}

form = new FormGroup<UserForm>({
  name: new FormControl<string>(''),
  email: new FormControl<string>('')
});
```

## 📊 Rapports Générés

L'outil génère automatiquement :

- 📄 **Rapport HTML** : Interface visuelle avec statistiques
- 📋 **Rapport JSON** : Données structurées pour intégration
- 📝 **Rapport Markdown** : Documentation lisible
- 📈 **Métriques** : Temps d'exécution, fichiers modifiés, etc.

## 🛡️ Sécurité et Sauvegarde

- ✅ **Sauvegarde automatique** avant toute modification
- 🔒 **Mode dry-run** pour tester sans risque
- 📋 **Logs détaillés** de toutes les opérations
- 🔄 **Rollback** possible en cas d'erreur

## 🎮 Options Avancées

### Filtrage des Fichiers
```bash
# Exclure certains fichiers
npm run migrate -- migrate -p /projet --exclude "*.spec.ts,*.test.ts"

# Inclure uniquement certains fichiers
npm run migrate -- migrate -p /projet --include "src/app/**/*.ts"
```

### Mode Verbose
```bash
# Affichage détaillé des opérations
npm run migrate -- migrate -p /projet --verbose
```

### Migration en Lot avec Filtres
```bash
# Migrer uniquement les projets Angular 5
npm run migrate -- batch -d /repertoire --only-angular5

# Migrer uniquement les projets avec backend Java
npm run migrate -- batch -d /repertoire --backend-types Java

# Migrer avec un délai entre les projets
npm run migrate -- batch -d /repertoire --delay 5000
```

## 🔍 Détection Automatique

L'outil détecte automatiquement :

- 📦 **Version Angular** actuelle
- 🔗 **Type de backend** associé
- 📁 **Structure du projet**
- 🎯 **Patterns Angular 5** à migrer
- ⚠️ **Problèmes potentiels**

## 📋 Prérequis

- Node.js 18+
- TypeScript 5+
- npm ou yarn
- Projets Angular 5 valides

## 🚨 Limitations

- Migration frontend uniquement (Angular)
- Nécessite une structure de projet Angular valide
- Certaines transformations peuvent nécessiter une révision manuelle
- Compatible avec Angular 5 → Angular 20

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :

1. Consulter la documentation
2. Vérifier les issues existantes
3. Créer une nouvelle issue avec les détails
4. Joindre les logs d'erreur

---

*Outil développé pour simplifier la migration d'Angular 5 vers Angular 20, compatible avec tous types de backends.*
