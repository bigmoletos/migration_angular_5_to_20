# 📚 Mémo Angular - 10 Points Fondamentaux

## 1. 🏗️ Architecture et Structure

### Composants (Components)
- **Définition** : Blocs de construction réutilisables qui encapsulent la logique et l'interface utilisateur
- **Structure** : TypeScript + Template HTML + Styles CSS/SCSS
- **Décorateur** : `@Component({ selector, template, styles })`
- **Cycle de vie** : `ngOnInit`, `ngOnDestroy`, `ngOnChanges`, etc.

```typescript
@Component({
  selector: 'app-example',
  template: '<h1>{{title}}</h1>',
  styles: ['h1 { color: blue; }']
})
export class ExampleComponent implements OnInit {
  title = 'Hello Angular';

  ngOnInit() {
    // Logique d'initialisation
  }
}
```

### Modules (NgModules)
- **Définition** : Conteneurs qui organisent les composants, services, et directives
- **Déclaration** : `@NgModule({ declarations, imports, providers, exports })`
- **Standalone** : Nouvelle approche sans NgModule (Angular 14+)

## 2. 🔄 Data Binding et Interpolation

### Types de Data Binding
- **Interpolation** : `{{expression}}` - Affichage de données
- **Property Binding** : `[property]="expression"` - Liaison de propriétés
- **Event Binding** : `(event)="method()"` - Gestion d'événements
- **Two-way Binding** : `[(ngModel)]="property"` - Liaison bidirectionnelle

```html
<!-- Interpolation -->
<h1>{{title}}</h1>

<!-- Property Binding -->
<img [src]="imageUrl" [alt]="description">

<!-- Event Binding -->
<button (click)="onClick()">Cliquer</button>

<!-- Two-way Binding -->
<input [(ngModel)]="userName" placeholder="Nom d'utilisateur">
```

## 3. 🎯 Directives et Pipes

### Directives Structurelles
- **\*ngIf** : Affichage conditionnel
- **\*ngFor** : Boucles sur des listes
- **\*ngSwitch** : Sélection multiple
- **Nouveau contrôle de flux** : `@if`, `@for`, `@switch` (Angular 17+)

```html
<!-- Ancien style -->
<div *ngIf="isVisible">Contenu conditionnel</div>
<li *ngFor="let item of items">{{item.name}}</li>

<!-- Nouveau style (Angular 17+) -->
@if (isVisible) {
  <div>Contenu conditionnel</div>
}
@for (item of items; track item.id) {
  <li>{{item.name}}</li>
}
```

### Pipes
- **Définition** : Transformateurs de données pour l'affichage
- **Built-in** : `date`, `currency`, `uppercase`, `lowercase`, `json`
- **Custom** : Création de pipes personnalisés

```html
<!-- Pipes intégrés -->
<p>{{date | date:'short'}}</p>
<p>{{price | currency:'EUR'}}</p>
<p>{{text | uppercase}}</p>

<!-- Pipe personnalisé -->
<p>{{data | customPipe}}</p>
```

## 4. 🛠️ Services et Injection de Dépendances

### Services
- **Définition** : Classes qui fournissent des fonctionnalités partagées
- **Décorateur** : `@Injectable()`
- **Singleton** : Une seule instance par application
- **Injection** : Via constructeur ou fonction `inject()`

```typescript
// Ancien style (constructeur)
@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get('/api/data');
  }
}

// Nouveau style (inject function)
@Injectable()
export class DataService {
  private http = inject(HttpClient);

  getData() {
    return this.http.get('/api/data');
  }
}
```

### Injection de Dépendances
- **Providers** : Configuration de l'injection
- **Hierarchie** : Injection au niveau composant, module, ou application
- **Tokens** : Clés d'identification des services

## 5. 🛣️ Routing et Navigation

### Configuration du Router
- **Routes** : Définition des chemins et composants associés
- **RouterModule** : Module de routage
- **Guards** : Protection des routes (CanActivate, CanDeactivate)
- **Resolvers** : Pré-chargement de données

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];
```

### Navigation
```typescript
// Navigation programmatique
constructor(private router: Router) {}

navigateToUser(id: number) {
  this.router.navigate(['/user', id]);
}

// Navigation relative
this.router.navigate(['../'], { relativeTo: this.route });
```

## 6. 📝 Formulaires (Reactive Forms)

### Formulaires Réactifs
- **FormGroup** : Groupe de contrôles
- **FormControl** : Contrôle individuel
- **FormBuilder** : Constructeur de formulaires
- **Validation** : Validators intégrés et personnalisés

```typescript
// Formulaires typés (Angular 14+)
interface UserForm {
  name: string;
  email: string;
  age: number;
}

export class UserComponent {
  userForm = this.fb.group<UserForm>({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required, Validators.min(18)]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

### Template
```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input formControlName="name" placeholder="Nom">
  <input formControlName="email" placeholder="Email">
  <input formControlName="age" type="number" placeholder="Âge">
  <button type="submit" [disabled]="userForm.invalid">Envoyer</button>
</form>
```

## 7. 🌐 HTTP et Communication Backend

### HttpClient
- **Service** : `HttpClient` pour les requêtes HTTP
- **Méthodes** : `get()`, `post()`, `put()`, `delete()`
- **Observables** : Gestion asynchrone avec RxJS
- **Interceptors** : Modification des requêtes/réponses

```typescript
@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}
```

### Gestion des Erreurs
```typescript
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse) {
  console.error('Erreur API:', error);
  return throwError(() => new Error('Erreur lors du chargement'));
}
```

## 8. 🔄 RxJS et Programmation Réactive

### Observables
- **Définition** : Flux de données asynchrones
- **Opérateurs** : `map`, `filter`, `switchMap`, `mergeMap`, `catchError`
- **Subjects** : `Subject`, `BehaviorSubject`, `ReplaySubject`
- **Unsubscribe** : Éviter les fuites mémoire

```typescript
export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  data$ = new BehaviorSubject<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.apiService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data$.next(data));
  }
}
```

### Opérateurs Courants
```typescript
// Transformation
data$.pipe(
  map(item => item.name),
  filter(name => name.length > 3),
  distinctUntilChanged()
);

// Combinaison
combineLatest([users$, posts$]).pipe(
  map(([users, posts]) => ({ users, posts }))
);
```

## 9. 🧪 Tests et Qualité

### Tests Unitaires (Jasmine/Karma)
- **Composants** : Test d'initialisation, méthodes, événements
- **Services** : Test de logique métier, injection
- **Pipes** : Test de transformation de données
- **Mocks** : Simulation de dépendances

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email', () => {
    component.userForm.get('email')?.setValue('invalid-email');
    expect(component.userForm.get('email')?.invalid).toBeTruthy();
  });
});
```

### Tests d'Intégration
- **E2E** : Tests end-to-end avec Protractor/Cypress
- **API** : Tests d'intégration avec le backend
- **Performance** : Tests de charge et de performance

## 10. 🚀 Performance et Optimisation

### Change Detection
- **OnPush** : Stratégie de détection optimisée
- **TrackBy** : Optimisation des listes
- **Async Pipe** : Gestion automatique des subscriptions

```typescript
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  items$ = this.dataService.getItems();

  trackByFn(index: number, item: any) {
    return item.id;
  }
}
```

### Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  }
];
```

### Optimisations
- **OnPush Strategy** : Réduction des cycles de détection
- **Lazy Loading** : Chargement à la demande
- **Tree Shaking** : Élimination du code mort
- **AOT Compilation** : Compilation ahead-of-time
- **Standalone Components** : Réduction de la complexité des modules

---

## 🎯 Points Clés à Retenir

1. **Composants** : Blocs de base réutilisables
2. **Data Binding** : Liaison bidirectionnelle des données
3. **Directives** : Manipulation du DOM et logique conditionnelle
4. **Services** : Logique métier partagée
5. **Routing** : Navigation entre vues
6. **Formulaires** : Gestion des données utilisateur
7. **HTTP** : Communication avec le backend
8. **RxJS** : Programmation réactive
9. **Tests** : Assurance qualité
10. **Performance** : Optimisation et bonnes pratiques

---

*Ce mémo couvre les concepts fondamentaux d'Angular pour une compréhension solide du framework.*
