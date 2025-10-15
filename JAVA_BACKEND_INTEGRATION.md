# ☕ Intégration Backend Java - Migration Angular 5 → Angular 20

## 🎯 Architecture Java + Angular

### **Stack Technologique Complète**
- **Frontend** : Angular 5 → Angular 20 (Migration)
- **Backend** : Java (Spring Boot, Maven/Gradle)
- **Testing** : Protractor, Cypress, Jenkins
- **Package Manager** : npm
- **SDK** : SDK fourni aux équipes produits

## 🏗️ Architecture Java + Angular

### **1. Structure du Projet Java**
```
java-angular-project/
├── backend/                    # Backend Java
│   ├── src/main/java/         # Code Java
│   ├── src/main/resources/    # Configuration
│   ├── pom.xml               # Maven
│   └── target/               # Build Maven
├── frontend/                  # Frontend Angular
│   ├── src/                  # Code Angular
│   ├── package.json          # npm
│   └── angular.json          # Configuration Angular
├── e2e/                      # Tests E2E
│   ├── protractor.conf.js    # Protractor
│   └── cypress/              # Cypress
└── jenkins/                  # CI/CD
    └── Jenkinsfile           # Pipeline Jenkins
```

### **2. Communication Frontend-Backend**
```typescript
// Angular Service pour communication Java
@Injectable({
  providedIn: 'root'
})
export class JavaBackendService {
  private http = inject(HttpClient);
  private baseUrl = environment.javaApiUrl; // http://localhost:8080/api
  
  // Endpoints Java Spring Boot
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }
  
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
```

## 🔧 Configuration Java + Angular

### **1. Configuration Angular pour Java**
```typescript
// environment.ts
export const environment = {
  production: false,
  javaApiUrl: 'http://localhost:8080/api',
  javaWsUrl: 'ws://localhost:8080/ws',
  javaAuthUrl: 'http://localhost:8080/auth'
};

// proxy.conf.json pour le développement
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### **2. Configuration Maven pour Angular**
```xml
<!-- pom.xml -->
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
```

## 🧪 Tests Java + Angular

### **1. Protractor (Tests E2E Angular)**
```javascript
// protractor.conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:4200',
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }
};

// e2e/app.e2e-spec.ts
describe('Angular Java Integration', () => {
  it('should display users from Java backend', () => {
    browser.get('/users');
    expect(element(by.css('app-user-list')).isPresent()).toBe(true);
    expect(element(by.css('.user-item')).count()).toBeGreaterThan(0);
  });
  
  it('should create user via Java API', () => {
    browser.get('/users/create');
    element(by.css('input[name="name"]')).sendKeys('John Doe');
    element(by.css('input[name="email"]')).sendKeys('john@example.com');
    element(by.css('button[type="submit"]')).click();
    
    expect(element(by.css('.success-message')).isPresent()).toBe(true);
  });
});
```

### **2. Cypress (Tests E2E Modernes)**
```typescript
// cypress/e2e/java-integration.cy.ts
describe('Java Backend Integration', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should load users from Java API', () => {
    cy.intercept('GET', 'http://localhost:8080/api/users', {
      fixture: 'users.json'
    }).as('getUsers');
    
    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('[data-cy="user-list"]').should('be.visible');
    cy.get('[data-cy="user-item"]').should('have.length.greaterThan', 0);
  });
  
  it('should create user via Java API', () => {
    cy.intercept('POST', 'http://localhost:8080/api/users', {
      statusCode: 201,
      body: { id: 1, name: 'John Doe', email: 'john@example.com' }
    }).as('createUser');
    
    cy.visit('/users/create');
    cy.get('[data-cy="name-input"]').type('John Doe');
    cy.get('[data-cy="email-input"]').type('john@example.com');
    cy.get('[data-cy="submit-button"]').click();
    
    cy.wait('@createUser');
    cy.get('[data-cy="success-message"]').should('be.visible');
  });
});
```

### **3. Tests Java Spring Boot**
```java
// UserControllerTest.java
@SpringBootTest
@AutoConfigureTestDatabase
class UserControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldGetUsers() {
        ResponseEntity<List<User>> response = restTemplate.exchange(
            "/api/users",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<User>>() {}
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
    }
    
    @Test
    void shouldCreateUser() {
        User user = new User("John Doe", "john@example.com");
        
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users",
            user,
            User.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getName()).isEqualTo("John Doe");
    }
}
```

## 🚀 Jenkins CI/CD

### **1. Jenkinsfile pour Java + Angular**
```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven-3.8.6'
        nodejs 'NodeJS-18.17.0'
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
        }
        
        stage('Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run test -- --watch=false --browsers=ChromeHeadless'
                }
            }
        }
        
        stage('E2E Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run e2e'
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
                    sh 'npm run build --prod'
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
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t java-angular-app .'
                sh 'docker push registry.company.com/java-angular-app:latest'
            }
        }
    }
    
    post {
        always {
            publishTestResults testResultsPattern: '**/test-results.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

### **2. Docker Configuration**
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

## 📦 SDK pour Équipes Produits

### **1. SDK Angular pour Java**
```typescript
// @company/angular-java-sdk
export class JavaAngularSDK {
  private http = inject(HttpClient);
  private config = inject(JavaSDKConfig);
  
  // Méthodes génériques pour communication Java
  async get<T>(endpoint: string): Promise<T> {
    return this.http.get<T>(`${this.config.baseUrl}${endpoint}`).toPromise();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.http.post<T>(`${this.config.baseUrl}${endpoint}`, data).toPromise();
  }
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.http.put<T>(`${this.config.baseUrl}${endpoint}`, data).toPromise();
  }
  
  async delete(endpoint: string): Promise<void> {
    return this.http.delete(`${this.config.baseUrl}${endpoint}`).toPromise();
  }
}

// Configuration du SDK
export interface JavaSDKConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  authToken?: string;
}
```

### **2. Utilisation du SDK**
```typescript
// Dans les équipes produits
@Component({
  selector: 'app-product',
  standalone: true,
  providers: [
    { provide: JavaSDKConfig, useValue: { baseUrl: 'https://api.company.com' } }
  ]
})
export class ProductComponent {
  private sdk = inject(JavaAngularSDK);
  
  async loadProducts() {
    const products = await this.sdk.get<Product[]>('/products');
    // Utilisation des produits
  }
}
```

## 🔄 Migration Java + Angular

### **1. Détection des Patterns Java + Angular 5**
```typescript
// Détection spécifique Java
export class JavaAngular5Analyzer extends Angular5Analyzer {
  async analyzeJavaIntegration(file: AnalyzedFile): Promise<MigrationIssue[]> {
    const issues: MigrationIssue[] = [];
    
    // Détection des patterns Java spécifiques
    if (file.content.includes('@angular/http')) {
      issues.push({
        type: IssueType.DEPRECATED_API,
        severity: IssueSeverity.WARNING,
        message: 'Http module détecté - migration vers HttpClient recommandée',
        suggestion: 'Remplacer @angular/http par @angular/common/http pour Java Spring Boot'
      });
    }
    
    // Détection des endpoints Java
    const javaEndpoints = file.content.match(/http:\/\/localhost:8080\/api\/\w+/g);
    if (javaEndpoints) {
      issues.push({
        type: IssueType.BACKEND_INTEGRATION,
        severity: IssueSeverity.INFO,
        message: 'Endpoints Java Spring Boot détectés',
        suggestion: 'Vérifier la compatibilité avec Spring Boot 3+'
      });
    }
    
    return issues;
  }
}
```

### **2. Transformations Java + Angular**
```typescript
// Transformations spécifiques Java
export class JavaAngularTransformer extends ModernizationTransformer {
  async transformJavaIntegration(file: AnalyzedFile): Promise<Transformation[]> {
    const transformations: Transformation[] = [];
    
    // Migration des services Java
    if (file.content.includes('@angular/http')) {
      const newContent = file.content
        .replace(/import { Http } from '@angular\/http';/g, 'import { HttpClient } from \'@angular/common/http\';')
        .replace(/constructor\(private http: Http\)/g, 'constructor(private http: HttpClient)')
        .replace(/this\.http\.get\(/g, 'this.http.get<')
        .replace(/this\.http\.post\(/g, 'this.http.post<');
      
      transformations.push({
        type: TransformationType.UPDATE_JAVA_INTEGRATION,
        description: 'Migration vers HttpClient pour Java Spring Boot',
        before: file.content,
        after: newContent,
        status: TransformationStatus.PENDING
      });
    }
    
    return transformations;
  }
}
```

## 🎯 Bonnes Pratiques Java + Angular

### **1. Communication API**
```typescript
// Service optimisé pour Java Spring Boot
@Injectable({
  providedIn: 'root'
})
export class JavaApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.javaApiUrl;
  
  // Gestion des erreurs Java
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Erreur client:', error.error.message);
    } else {
      console.error(`Erreur serveur Java: ${error.status} - ${error.error.message}`);
    }
    return throwError(() => new Error('Erreur API Java'));
  }
  
  // Endpoints avec retry pour Java
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
}
```

### **2. Configuration Environnement**
```typescript
// environment.java.ts
export const environment = {
  production: false,
  javaApiUrl: 'http://localhost:8080/api',
  javaWsUrl: 'ws://localhost:8080/ws',
  javaAuthUrl: 'http://localhost:8080/auth',
  javaVersion: '17',
  springBootVersion: '3.1.0'
};
```

## 📊 Monitoring Java + Angular

### **1. Métriques de Performance**
```typescript
// Service de monitoring pour Java + Angular
@Injectable({
  providedIn: 'root'
})
export class JavaMonitoringService {
  private http = inject(HttpClient);
  
  // Métriques de performance
  trackApiCall(endpoint: string, duration: number) {
    console.log(`API Java ${endpoint}: ${duration}ms`);
  }
  
  // Monitoring des erreurs Java
  trackJavaError(error: HttpErrorResponse) {
    console.error('Erreur Java:', {
      status: error.status,
      message: error.message,
      endpoint: error.url
    });
  }
}
```

---

## 🎉 Résumé

Cette configuration optimise l'intégration entre :
- **Angular 5 → 20** (Migration frontend)
- **Java Spring Boot** (Backend)
- **Protractor + Cypress** (Tests E2E)
- **Jenkins** (CI/CD)
- **npm** (Package management)
- **SDK** (Pour les équipes produits)

L'architecture est maintenant parfaitement adaptée à votre écosystème Java ! 🚀
