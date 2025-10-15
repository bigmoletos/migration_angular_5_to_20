# 🌿 Organisation des Branches - Migration Angular 5 → Angular 20

## 📋 Vue d'Ensemble des Branches

Ce projet est organisé en **3 branches principales** pour une gestion optimale du développement et de la maintenance :

### 🏗️ **main** - Branche Principale
- **Description** : Branche stable avec le code complet du projet
- **Contenu** : Tous les fichiers du projet de migration
- **Utilisation** : Version de production, releases, documentation générale

### ⚙️ **core-engine** - Moteur de Migration
- **Description** : Code du moteur principal de migration
- **Contenu** :
  - `src/core/` - Moteurs de migration (MigrationEngine, BackendAgnosticMigrationEngine)
  - `src/analyzers/` - Analyseurs de patterns Angular 5
  - `src/transformers/` - Transformateurs de code
  - `src/types/` - Définitions TypeScript
- **Utilisation** : Développement du cœur de l'outil de migration

### 📚 **documentation** - Documentation
- **Description** : Documentation complète du projet
- **Contenu** :
  - `ANGULAR_MEMO.md` - Mémo Angular (10 points fondamentaux)
  - `ANGULAR_EVOLUTION_5_TO_20.md` - Évolution détaillée Angular 5→20
  - `ANGULAR_COMPLETE_GUIDE.md` - Guide complet Angular
  - `README.md` - Documentation principale
- **Utilisation** : Maintenance et amélioration de la documentation

### 🤖 **automation-scripts** - Scripts d'Automatisation
- **Description** : Scripts et outils d'automatisation
- **Contenu** :
  - `src/scripts/` - Scripts de migration en lot
  - `demo.js` - Script de démonstration
  - `src/index.ts` - Point d'entrée CLI
  - Scripts PowerShell pour l'environnement Windows
- **Utilisation** : Développement des outils d'automatisation

## 🔄 Workflow de Développement

### **1. Développement du Moteur**
```bash
# Basculer sur la branche core-engine
git checkout core-engine

# Développer les fonctionnalités du moteur
# Commiter les changements
git add .
git commit -m "feat: improve Angular 5 pattern detection"

# Pousser vers GitHub
git push origin core-engine
```

### **2. Amélioration de la Documentation**
```bash
# Basculer sur la branche documentation
git checkout documentation

# Mettre à jour la documentation
# Commiter les changements
git add .
git commit -m "docs: add new migration patterns guide"

# Pousser vers GitHub
git push origin documentation
```

### **3. Développement des Scripts**
```bash
# Basculer sur la branche automation-scripts
git checkout automation-scripts

# Développer les scripts d'automatisation
# Commiter les changements
git add .
git commit -m "feat: add batch migration script for multiple projects"

# Pousser vers GitHub
git push origin automation-scripts
```

### **4. Intégration dans Main**
```bash
# Basculer sur main
git checkout main

# Merger les changements des autres branches
git merge core-engine
git merge documentation
git merge automation-scripts

# Pousser la version intégrée
git push origin main
```

## 🎯 **Stratégie de Branches**

### **Avantages de cette Organisation**

#### **1. 🏗️ Séparation des Responsabilités**
- **Core Engine** : Focus sur la logique de migration
- **Documentation** : Focus sur la documentation et les guides
- **Automation Scripts** : Focus sur l'automatisation et les outils

#### **2. 🔄 Développement Parallèle**
- Équipes différentes peuvent travailler sur des aspects différents
- Pas de conflits entre documentation et code
- Tests indépendants par domaine

#### **3. 📦 Gestion des Releases**
- **Core Engine** : Releases du moteur de migration
- **Documentation** : Mises à jour de documentation
- **Automation Scripts** : Nouvelles fonctionnalités d'automatisation

#### **4. 🧪 Tests et Validation**
- Tests unitaires sur `core-engine`
- Validation de documentation sur `documentation`
- Tests d'intégration sur `automation-scripts`

## 📊 **Structure des Branches**

```
migration_angular_5_to_20/
├── main/                    # Branche principale
│   ├── src/                 # Code complet
│   ├── docs/               # Documentation
│   ├── scripts/            # Scripts
│   └── README.md           # Documentation principale
│
├── core-engine/            # Moteur de migration
│   ├── src/core/           # Moteurs principaux
│   ├── src/analyzers/      # Analyseurs
│   ├── src/transformers/   # Transformateurs
│   └── src/types/          # Types TypeScript
│
├── documentation/           # Documentation
│   ├── ANGULAR_MEMO.md     # Mémo Angular
│   ├── ANGULAR_EVOLUTION_5_TO_20.md
│   ├── ANGULAR_COMPLETE_GUIDE.md
│   └── README.md
│
└── automation-scripts/     # Scripts d'automatisation
    ├── src/scripts/        # Scripts de migration
    ├── demo.js             # Script de démonstration
    ├── src/index.ts        # CLI principal
    └── *.ps1               # Scripts PowerShell
```

## 🚀 **Utilisation des Branches**

### **Pour les Développeurs**
1. **Core Engine** : Développement du moteur de migration
2. **Documentation** : Mise à jour des guides et documentation
3. **Automation Scripts** : Création d'outils d'automatisation

### **Pour les Utilisateurs**
1. **Main** : Version stable complète
2. **Core Engine** : Moteur de migration uniquement
3. **Documentation** : Guides et documentation
4. **Automation Scripts** : Outils d'automatisation

### **Pour les Contributeurs**
1. Fork du projet
2. Création de branches feature depuis les branches appropriées
3. Pull requests vers les branches correspondantes
4. Intégration dans main après validation

## 🔗 **Liens GitHub**

- **Repository Principal** : https://github.com/bigmoletos/migration_angular_5_to_20
- **Branche Main** : https://github.com/bigmoletos/migration_angular_5_to_20/tree/main
- **Branche Core Engine** : https://github.com/bigmoletos/migration_angular_5_to_20/tree/core-engine
- **Branche Documentation** : https://github.com/bigmoletos/migration_angular_5_to_20/tree/documentation
- **Branche Automation Scripts** : https://github.com/bigmoletos/migration_angular_5_to_20/tree/automation-scripts

## 📝 **Bonnes Pratiques**

### **1. Commits**
- Utiliser des messages clairs et descriptifs
- Préfixer avec le type : `feat:`, `fix:`, `docs:`, `refactor:`
- Référencer les issues GitHub si applicable

### **2. Pull Requests**
- Créer des PR depuis les branches feature vers les branches appropriées
- Inclure une description détaillée des changements
- Tester avant de soumettre

### **3. Releases**
- Taguer les versions sur la branche main
- Documenter les changements dans les releases
- Maintenir la compatibilité ascendante

---

*Cette organisation permet une gestion efficace du projet de migration Angular avec une séparation claire des responsabilités et un workflow de développement optimisé.*
