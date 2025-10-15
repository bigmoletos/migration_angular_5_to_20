# 🤝 Guide de Contribution - Migration Angular 5 → Angular 20

## 🎯 Comment Contribuer

Ce projet utilise une architecture en **3 branches principales** pour organiser le développement. Voici comment contribuer efficacement :

## 🌿 **Architecture des Branches**

### **🏗️ main** - Branche Principale
- **Rôle** : Version stable et complète du projet
- **Contenu** : Tous les fichiers du projet
- **Utilisation** : Releases, documentation générale, version de production

### **⚙️ core-engine** - Moteur de Migration
- **Rôle** : Développement du moteur principal de migration
- **Contenu** :
  - `src/core/` - Moteurs de migration
  - `src/analyzers/` - Analyseurs de patterns Angular 5
  - `src/transformers/` - Transformateurs de code
  - `src/types/` - Définitions TypeScript
- **Focus** : Logique de migration, détection de patterns, transformations

### **📚 documentation** - Documentation
- **Rôle** : Documentation et guides du projet
- **Contenu** :
  - `ANGULAR_MEMO.md` - Mémo Angular (10 points fondamentaux)
  - `ANGULAR_EVOLUTION_5_TO_20.md` - Évolution détaillée
  - `ANGULAR_COMPLETE_GUIDE.md` - Guide complet
  - `README.md` - Documentation principale
- **Focus** : Guides, documentation, exemples

### **🤖 automation-scripts** - Scripts d'Automatisation
- **Rôle** : Outils et scripts d'automatisation
- **Contenu** :
  - `src/scripts/` - Scripts de migration en lot
  - `demo.js` - Script de démonstration
  - `src/index.ts` - Point d'entrée CLI
  - Scripts PowerShell
- **Focus** : Automatisation, CLI, outils de déploiement

## 🚀 **Workflow de Contribution**

### **1. Fork et Clone**
```bash
# Fork le repository sur GitHub
# Puis cloner votre fork
git clone https://github.com/VOTRE_USERNAME/migration_angular_5_to_20.git
cd migration_angular_5_to_20
```

### **2. Configuration des Remotes**
```bash
# Ajouter le repository original comme upstream
git remote add upstream https://github.com/bigmoletos/migration_angular_5_to_20.git

# Vérifier les remotes
git remote -v
```

### **3. Développement par Branche**

#### **Pour le Moteur de Migration**
```bash
# Basculer sur core-engine
git checkout core-engine
git pull upstream core-engine

# Créer une branche feature
git checkout -b feature/improve-angular5-detection

# Développer...
git add .
git commit -m "feat: improve Angular 5 pattern detection"

# Pousser vers votre fork
git push origin feature/improve-angular5-detection
```

#### **Pour la Documentation**
```bash
# Basculer sur documentation
git checkout documentation
git pull upstream documentation

# Créer une branche feature
git checkout -b feature/add-migration-examples

# Développer...
git add .
git commit -m "docs: add practical migration examples"

# Pousser vers votre fork
git push origin feature/add-migration-examples
```

#### **Pour les Scripts d'Automatisation**
```bash
# Basculer sur automation-scripts
git checkout automation-scripts
git pull upstream automation-scripts

# Créer une branche feature
git checkout -b feature/add-batch-processing

# Développer...
git add .
git commit -m "feat: add batch processing for multiple projects"

# Pousser vers votre fork
git push origin feature/add-batch-processing
```

### **4. Pull Requests**

#### **Créer une Pull Request**
1. Aller sur GitHub
2. Cliquer sur "New Pull Request"
3. Sélectionner la branche appropriée :
   - **core-engine** pour les changements du moteur
   - **documentation** pour les changements de documentation
   - **automation-scripts** pour les scripts
4. Remplir le template de PR

#### **Template de Pull Request**
```markdown
## 📋 Description
Décrivez les changements apportés...

## 🎯 Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation
- [ ] Refactoring

## 🧪 Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## 📚 Documentation
- [ ] Documentation mise à jour
- [ ] README mis à jour si nécessaire
- [ ] Commentaires ajoutés dans le code

## 🔍 Checklist
- [ ] Code conforme aux standards du projet
- [ ] Tests passent
- [ ] Documentation à jour
- [ ] Pas de conflits avec la branche cible
```

## 📝 **Standards de Code**

### **TypeScript/Angular**
```typescript
// Utiliser les standards modernes Angular
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Utiliser inject() au lieu du constructeur
  private service = inject(MyService);
  
  // Utiliser signals pour l'état
  data = signal<MyData[]>([]);
  loading = signal(false);
  
  // Utiliser computed pour les valeurs dérivées
  filteredData = computed(() => 
    this.data().filter(item => item.active)
  );
}
```

### **Commits**
```bash
# Format des messages de commit
<type>(<scope>): <description>

# Types disponibles
feat:     nouvelle fonctionnalité
fix:      correction de bug
docs:     documentation
style:    formatage, point-virgules manquants, etc.
refactor: refactoring du code
test:     ajout de tests
chore:    maintenance

# Exemples
feat(core): add Angular 5 pattern detection
fix(transformer): resolve standalone component conversion
docs(guide): add migration examples
```

### **Tests**
```typescript
// Structure des tests
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentName] // Pour les standalone components
    });
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle specific functionality', () => {
    // Test spécifique
    expect(component.someMethod()).toBe(expectedValue);
  });
});
```

## 🧪 **Tests et Validation**

### **Tests Obligatoires**
- [ ] Tests unitaires pour toutes les nouvelles fonctionnalités
- [ ] Tests d'intégration pour les workflows complets
- [ ] Tests de régression pour les migrations
- [ ] Validation des transformations de code

### **Commandes de Test**
```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Linting
npm run lint

# Build
npm run build
```

## 📚 **Documentation**

### **Types de Documentation**
- **Code** : JSDoc pour toutes les APIs publiques
- **Guides** : Documentation utilisateur complète
- **Exemples** : Exemples pratiques d'utilisation
- **Troubleshooting** : Guide de résolution des problèmes

### **Standards de Documentation**
```typescript
/**
 * Migre un projet Angular 5 vers Angular 20
 * @param projectPath - Chemin vers le projet à migrer
 * @param options - Options de migration
 * @returns Promise<MigrationReport> - Rapport de migration
 * @example
 * ```typescript
 * const report = await engine.migrateProject('/path/to/project', {
 *   mode: 'migrate',
 *   autoApply: true
 * });
 * ```
 */
async migrateProject(projectPath: string, options: MigrationOptions): Promise<MigrationReport> {
  // Implementation...
}
```

## 🔄 **Processus de Review**

### **Critères d'Acceptation**
- [ ] Code conforme aux standards
- [ ] Tests passent (100% de couverture pour les nouvelles fonctionnalités)
- [ ] Documentation mise à jour
- [ ] Pas de régression
- [ ] Performance acceptable
- [ ] Sécurité validée

### **Review Process**
1. **Auto-review** : Vérifier votre code avant de soumettre
2. **Tests automatiques** : S'assurer que tous les tests passent
3. **Review par les pairs** : Au moins 1 approbation requise
4. **Tests d'intégration** : Validation sur différents environnements
5. **Merge** : Intégration dans la branche appropriée

## 🚨 **Problèmes et Support**

### **Signaler un Bug**
1. Vérifier que le bug n'a pas déjà été signalé
2. Créer une issue avec le template approprié
3. Inclure les informations de reproduction
4. Ajouter les logs et captures d'écran si nécessaire

### **Proposer une Fonctionnalité**
1. Créer une issue avec le label "enhancement"
2. Décrire la fonctionnalité en détail
3. Expliquer les cas d'usage
4. Proposer une implémentation si possible

### **Questions et Support**
- **Issues GitHub** : Pour les bugs et fonctionnalités
- **Discussions** : Pour les questions générales
- **Wiki** : Pour la documentation étendue

## 🎉 **Reconnaissance**

Les contributeurs seront reconnus dans :
- **README.md** : Liste des contributeurs
- **CHANGELOG.md** : Mentions dans les releases
- **Releases** : Notes de remerciement

---

*Merci de contribuer à ce projet de migration Angular ! Votre aide est précieuse pour aider la communauté à migrer efficacement vers les versions modernes d'Angular.*
