# ☕ Configuration Écosystème Java - Migration Angular

## 🎯 Stack Technologique Java + Angular

### **Architecture Complète**
```
Java Angular Ecosystem
├── Backend: Java 17+ / Spring Boot 3+
├── Frontend: Angular 5 → Angular 20
├── Testing: Protractor + Cypress
├── CI/CD: Jenkins
├── Build: Maven + npm
└── SDK: Custom SDK for product teams
```

## 🏗️ Configuration Java + Angular

### **1. Structure de Projet Java + Angular**
```
java-angular-migration-project/
├── backend/                          # Backend Java
│   ├── src/main/java/               # Code Java Spring Boot
│   │   ├── com/company/api/         # Controllers
│   │   ├── com/company/service/     # Services
│   │   └── com/company/model/      # Entities
│   ├── src/main/resources/          # Configuration
│   │   ├── application.yml         # Spring Boot config
│   │   └── application-dev.yml     # Dev environment
│   ├── src/test/java/              # Tests Java
│   ├── pom.xml                     # Maven configuration
│   └── target/                     # Maven build output
├── frontend/                        # Frontend Angular
│   ├── src/                        # Code Angular
│   │   ├── app/                    # Application
│   │   ├── assets/                 # Static assets
│   │   └── environments/          # Environment configs
│   ├── e2e/                        # E2E Tests
│   │   ├── protractor.conf.js     # Protractor config
│   │   └── cypress/                # Cypress tests
│   ├── package.json               # npm dependencies
│   ├── angular.json               # Angular configuration
│   └── tsconfig.json              # TypeScript config
├── jenkins/                        # CI/CD
│   ├── Jenkinsfile                # Pipeline Jenkins
│   └── docker/                    # Docker configuration
├── sdk/                           # SDK for product teams
│   ├── src/                       # SDK source code
│   ├── dist/                      # Built SDK
│   └── package.json               # SDK package
└── docs/                          # Documentation
    ├── java-integration.md        # Java integration guide
    └── migration-guide.md         # Migration documentation
```

## ☕ Configuration Java Spring Boot

### **1. pom.xml Configuration**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.company</groupId>
    <artifactId>java-angular-migration</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            
            <!-- Frontend Maven Plugin -->
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>1.15.0</version>
                <configuration>
                    <workingDirectory>frontend</workingDirectory>
                </configuration>
                <executions>
                    <execution>
                        <id>install node and npm</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                        <configuration>
                            <nodeVersion>v18.17.0</nodeVersion>
                            <npmVersion>9.6.7</npmVersion>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm install</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>
                    <execution>
                        <id>npm run build</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

### **2. Spring Boot Configuration**
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: java-angular-migration
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

# CORS Configuration for Angular
cors:
  allowed-origins: "http://localhost:4200"
  allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
  allowed-headers: "*"
  allow-credentials: true

# Logging
logging:
  level:
    com.company: DEBUG
    org.springframework.web: DEBUG
```

## 🅰️ Configuration Angular pour Java

### **1. package.json avec Java Integration**
```json
{
  "name": "angular-java-migration",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --proxy-config proxy.conf.json",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
    "e2e": "ng e2e",
    "e2e:protractor": "protractor protractor.conf.js",
    "e2e:cypress": "cypress run",
    "lint": "ng lint",
    "build:java": "mvn clean package"
  },
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "@angular/material": "^20.0.0",
    "rxjs": "^7.8.0",
    "zone.js": "^0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/jasmine": "^4.3.0",
    "@types/node": "^20.0.0",
    "cypress": "^13.0.0",
    "jasmine-core": "^4.6.0",
    "karma": "^6.4.0",
    "karma-chrome-launcher": "^3.1.0",
    "karma-coverage": "^2.2.0",
    "karma-jasmine": "^5.1.0",
    "karma-jasmine-html-reporter": "^2.1.0",
    "protractor": "^7.0.0",
    "typescript": "^5.0.0"
  }
}
```

### **2. Angular Configuration pour Java**
```json
// angular.json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "angular-java-migration": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "standalone": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/angular-java-migration",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "angular-java-migration:build:production"
            },
            "development": {
              "buildTarget": "angular-java-migration:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "angular-java-migration:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          }
        },
        "e2e": {
          "builder": "@cypress/schematic:cypress",
          "options": {
            "devServerTarget": "angular-java-migration:serve"
          }
        }
      }
    }
  }
}
```

### **3. Proxy Configuration pour Java**
```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  },
  "/h2-console/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## 🧪 Configuration Tests Java + Angular

### **1. Protractor Configuration**
```javascript
// protractor.conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
    }
  },
  baseUrl: 'http://localhost:4200',
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  },
  params: {
    javaApiUrl: 'http://localhost:8080/api'
  }
};
```

### **2. Cypress Configuration**
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      // Configuration pour Java backend
      config.env.javaApiUrl = 'http://localhost:8080/api';
      return config;
    }
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    }
  }
});
```

## 🚀 Jenkins CI/CD Configuration

### **1. Jenkinsfile pour Java + Angular**
```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven-3.8.6'
        nodejs 'NodeJS-18.17.0'
        jdk 'JDK-17'
    }
    
    environment {
        JAVA_HOME = tool 'JDK-17'
        MAVEN_HOME = tool 'Maven-3.8.6'
        NODE_HOME = tool 'NodeJS-18.17.0'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'mvn clean test'
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run test:ci'
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'frontend/test-results.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage Report'
                    ])
                }
            }
        }
        
        stage('E2E Tests - Protractor') {
            steps {
                dir('frontend') {
                    sh 'npm run e2e:protractor'
                }
            }
        }
        
        stage('E2E Tests - Cypress') {
            steps {
                dir('frontend') {
                    sh 'npm run e2e:cypress'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build:prod'
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'docker-compose up -d'
                sh 'npm run test:integration'
                sh 'docker-compose down'
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh 'docker build -t java-angular-app:staging .'
                sh 'docker push registry.company.com/java-angular-app:staging'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t java-angular-app:latest .'
                sh 'docker push registry.company.com/java-angular-app:latest'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Check console output at ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

## 📦 SDK Configuration pour Équipes Produits

### **1. SDK Package Configuration**
```json
// sdk/package.json
{
  "name": "@company/angular-java-sdk",
  "version": "1.0.0",
  "description": "SDK Angular pour intégration Java Spring Boot",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "@angular/core": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/common/http": "^20.0.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^20.0.0",
    "@angular/common": "^20.0.0"
  }
}
```

### **2. SDK TypeScript Configuration**
```json
// sdk/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## 🐳 Docker Configuration

### **1. Dockerfile Multi-stage**
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim as backend
WORKDIR /app
COPY backend/target/*.jar app.jar
EXPOSE 8080

FROM node:18-alpine as frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY --from=backend /app/app.jar /app/app.jar
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 8080
```

### **2. Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    volumes:
      - ./backend/target:/app/target
  
  frontend:
    build: ./frontend
    ports:
      - "4200:4200"
    depends_on:
      - backend
    environment:
      - JAVA_API_URL=http://backend:8080/api
```

---

## 🎉 Résumé Configuration Java + Angular

Cette configuration optimise l'intégration entre :
- **☕ Java 17+ / Spring Boot 3+** (Backend)
- **🅰️ Angular 5 → 20** (Frontend Migration)
- **🧪 Protractor + Cypress** (E2E Testing)
- **🚀 Jenkins** (CI/CD)
- **📦 npm + Maven** (Build Systems)
- **🔧 SDK** (Pour équipes produits)

L'écosystème est maintenant parfaitement configuré pour votre environnement Java ! 🚀
