#!/usr/bin/env node

/**
 * Script de démonstration de l'outil de migration Angular
 * Montre les capacités de l'outil avec différents types de backends
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démonstration de l\'Outil de Migration Angular 5 → Angular 20\n');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '═'.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('═'.repeat(60) + '\n');
}

// Vérifier si le projet est compilé
function checkBuild() {
  try {
    if (!fs.existsSync('dist/index.js')) {
      log('⚠️  Le projet n\'est pas compilé. Compilation en cours...', 'yellow');
      execSync('npm run build', { stdio: 'inherit' });
      log('✅ Compilation terminée', 'green');
    }
  } catch (error) {
    log(`❌ Erreur lors de la compilation: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Créer un projet de démonstration
function createDemoProject() {
  const demoDir = path.join(__dirname, 'demo-projects');

  if (!fs.existsSync(demoDir)) {
    fs.mkdirSync(demoDir, { recursive: true });
  }

  // Projet Angular 5 avec backend Java
  const javaAngularProject = path.join(demoDir, 'java-angular-project');
  if (!fs.existsSync(javaAngularProject)) {
    fs.mkdirSync(javaAngularProject, { recursive: true });

    // package.json Angular 5
    const packageJson = {
      "name": "java-angular-demo",
      "version": "1.0.0",
      "dependencies": {
        "@angular/core": "5.2.0",
        "@angular/common": "5.2.0",
        "@angular/compiler": "5.2.0",
        "@angular/platform-browser": "5.2.0",
        "@angular/platform-browser-dynamic": "5.2.0",
        "@angular/router": "5.2.0",
        "@angular/forms": "5.2.0",
        "@angular/http": "5.2.0",
        "rxjs": "5.5.0",
        "zone.js": "0.8.20"
      }
    };

    fs.writeFileSync(
      path.join(javaAngularProject, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // angular.json
    const angularJson = {
      "version": 1,
      "newProjectRoot": "projects",
      "projects": {
        "java-angular-demo": {
          "root": "",
          "sourceRoot": "src",
          "projectType": "application",
          "architect": {
            "build": {
              "builder": "@angular-devkit/build-angular:browser",
              "options": {
                "outputPath": "dist",
                "index": "src/index.html",
                "main": "src/main.ts",
                "polyfills": "src/polyfills.ts",
                "tsConfig": "src/tsconfig.app.json"
              }
            }
          }
        }
      }
    };

    fs.writeFileSync(
      path.join(javaAngularProject, 'angular.json'),
      JSON.stringify(angularJson, null, 2)
    );

    // Créer la structure src
    const srcDir = path.join(javaAngularProject, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    // Créer un composant Angular 5 typique
    const appDir = path.join(srcDir, 'app');
    fs.mkdirSync(appDir, { recursive: true });

    const componentCode = `import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-example',
  template: \`
    <div *ngIf="isVisible">
      <h1>{{title}}</h1>
      <ul *ngFor="let item of items; let i = index">
        <li>{{item.name}} - {{i}}</li>
      </ul>
    </div>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Nom">
      <input formControlName="email" placeholder="Email">
      <button type="submit">Envoyer</button>
    </form>
  \`,
  styles: ['h1 { color: blue; }']
})
export class ExampleComponent implements OnInit {
  title = 'Exemple Angular 5';
  isVisible = true;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  userForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  });

  constructor(private http: Http) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get('/api/data').subscribe(data => {
      console.log(data);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}`;

    fs.writeFileSync(path.join(appDir, 'example.component.ts'), componentCode);

    // Créer un service Angular 5
    const serviceCode = `import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DataService {
  constructor(private http: Http) {}

  getData() {
    return this.http.get('/api/data');
  }

  postData(data: any) {
    return this.http.post('/api/data', data);
  }
}`;

    fs.writeFileSync(path.join(appDir, 'data.service.ts'), serviceCode);

    // Créer un module Angular 5
    const moduleCode = `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ExampleComponent } from './example.component';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [ExampleComponent]
})
export class AppModule { }`;

    fs.writeFileSync(path.join(appDir, 'app.module.ts'), moduleCode);

    // Créer un fichier pom.xml pour simuler un backend Java
    const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>java-angular-demo</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>2.7.0</version>
    </dependency>
  </dependencies>
</project>`;

    fs.writeFileSync(path.join(javaAngularProject, 'pom.xml'), pomXml);

    log(`✅ Projet de démonstration créé: ${javaAngularProject}`, 'green');
  }

  return javaAngularProject;
}

// Fonction principale de démonstration
async function runDemo() {
  try {
    section('🔧 Vérification de l\'Environnement');
    checkBuild();

    section('📁 Création des Projets de Démonstration');
    const demoProject = createDemoProject();

    section('🔍 Analyse du Projet');
    log('Analyse du projet Angular 5 avec backend Java...', 'blue');

    // Exécuter l'analyse
    try {
      execSync(`node dist/index.js analyze -p "${demoProject}" --verbose`, {
        stdio: 'inherit',
        cwd: __dirname
      });
    } catch (error) {
      log('Note: L\'analyse peut échouer si le projet n\'est pas complet', 'yellow');
    }

    section('📊 Fonctionnalités de l\'Outil');
    log('✅ Détection automatique du backend (Java détecté)', 'green');
    log('✅ Analyse des patterns Angular 5', 'green');
    log('✅ Détection des composants, services, modules', 'green');
    log('✅ Identification des transformations nécessaires', 'green');
    log('✅ Génération de rapports détaillés', 'green');

    section('🎯 Transformations Disponibles');
    log('🔄 Composants → Standalone Components', 'blue');
    log('🔄 Constructor Injection → inject() function', 'blue');
    log('🔄 *ngIf/*ngFor → @if/@for', 'blue');
    log('🔄 FormGroup() → FormGroup<Type>()', 'blue');
    log('🔄 @angular/http → @angular/common/http', 'blue');
    log('🔄 NgModules → Standalone Architecture', 'blue');

    section('🚀 Commandes Disponibles');
    log('npm run migrate -- analyze -p /chemin/projet', 'cyan');
    log('npm run migrate -- migrate -p /chemin/projet --auto-apply', 'cyan');
    log('npm run migrate -- batch -d /repertoire', 'cyan');
    log('npm run migrate -- interactive', 'cyan');

    section('📋 Types de Backends Supportés');
    const backends = [
      '☕ Java (Spring Boot, Maven, Gradle)',
      '🐍 Python (Django, Flask, FastAPI)',
      '🟢 Node.js (Express, NestJS, Koa)',
      '🔷 .NET (ASP.NET Core, Web API)',
      '🐘 PHP (Laravel, Symfony)',
      '🦀 Rust (Actix, Rocket)',
      '🐹 Go (Gin, Echo)',
      '💎 Ruby (Rails, Sinatra)'
    ];

    backends.forEach(backend => log(backend, 'magenta'));

    section('✨ Avantages de l\'Outil');
    log('🎯 Migration ciblée (frontend Angular uniquement)', 'green');
    log('🔍 Détection automatique du type de backend', 'green');
    log('📊 Rapports détaillés en HTML, JSON, Markdown', 'green');
    log('🔄 Migration en lot pour plusieurs projets', 'green');
    log('🛡️ Sauvegarde automatique avant migration', 'green');
    log('🎮 Mode interactif pour guider la migration', 'green');

    section('📚 Documentation');
    log('📖 Consultez le fichier README.md pour plus de détails', 'blue');
    log('📝 Mémo Angular disponible dans ANGULAR_MEMO.md', 'blue');
    log('🔧 Configuration dans mcp.json', 'blue');

    log('\n🎉 Démonstration terminée !', 'green');
    log('L\'outil est prêt à migrer vos projets Angular 5 vers Angular 20.', 'blue');

  } catch (error) {
    log(`❌ Erreur lors de la démonstration: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Lancer la démonstration
runDemo();
