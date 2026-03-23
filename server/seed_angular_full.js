const { mongoose, Question, Interaction } = require('./db/database');

const q = (question, answer, difficulty) => ({ question, answer, category: 'Angular', difficulty });

const questions = [
  q("What is Angular and how is it different from AngularJS?",
  `Angular (v2+) is a TypeScript-based complete rewrite of AngularJS.
Key differences:
• Language: Angular uses TypeScript; AngularJS uses plain JavaScript.
• Architecture: Angular is component-based; AngularJS follows MVC with $scope.
• Performance: Angular uses AOT compilation and unidirectional data flow; much faster.
• Mobile: Angular is mobile-first; AngularJS was desktop-only.
• CLI: Angular has a powerful CLI; AngularJS had none.
• DI: Angular has hierarchical injectors; AngularJS had a flat DI system.
• Two-way binding: Angular uses [(ngModel)] with explicit import; AngularJS uses ng-model implicitly.`, "Beginner"),

  q("Explain the Angular architecture.",
  `Angular apps follow a modular, component-based architecture:

1. Modules (NgModule / Standalone) — group related components, directives, pipes, and services.
2. Components — the building blocks of UI; each has a class, template, and styles.
3. Templates — HTML extended with Angular syntax (directives, bindings, pipes).
4. Metadata — decorators (@Component, @NgModule) that tell Angular how to process a class.
5. Data Binding — bridges component class ↔ template (interpolation, property, event, two-way).
6. Directives — extend HTML behavior (structural: *ngIf, *ngFor; attribute: ngClass, ngStyle).
7. Services — reusable business logic injected via DI.
8. Dependency Injection — Angular's built-in IoC container.
9. Routing — maps URL paths to components.
10. HttpClient — communicates with REST APIs via Observables.`, "Beginner"),

  q("What is a module in Angular?",
  `An NgModule is a container that groups related code into a functional unit.

@NgModule({
  declarations: [AppComponent, HeaderComponent], // components, directives, pipes
  imports: [BrowserModule, RouterModule],         // other modules
  exports: [HeaderComponent],                    // share with other modules
  providers: [AuthService],                      // services
  bootstrap: [AppComponent]                      // root component
})
export class AppModule {}

Angular 14+ Standalone Components: Allow skipping NgModules entirely — a component declares its own imports directly.

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: '...'
})
export class MyComponent {}`, "Beginner"),

  q("What is a component?",
  `A Component controls a patch of the screen (a view). It consists of:
• A TypeScript class with the business logic.
• An HTML template that defines the view.
• CSS styles scoped to this component.

@Component({
  selector: 'app-user',          // custom HTML tag
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  name = 'Bharat';
}

The selector is used in parent templates: <app-user></app-user>
Components communicate via @Input() (parent → child) and @Output() with EventEmitter (child → parent).`, "Beginner"),

  q("Component lifecycle hooks.",
  `Angular calls these hooks in order as it creates, updates, and destroys a component:

1. ngOnChanges() — called when @Input() values change (before ngOnInit).
2. ngOnInit() — called once after first ngOnChanges; initialize data here (NOT constructor).
3. ngDoCheck() — called on every CD cycle; detect custom changes.
4. ngAfterContentInit() — after ng-content is projected.
5. ngAfterContentChecked() — after every check of projected content.
6. ngAfterViewInit() — after component's view and child views are initialized. Access @ViewChild here.
7. ngAfterViewChecked() — after every check of the view.
8. ngOnDestroy() — cleanup: unsubscribe Observables, clear timers, detach event handlers.

Most used: ngOnInit (init), ngOnChanges (react to inputs), ngOnDestroy (cleanup).`, "Beginner"),

  q("What is data binding?",
  `Data binding is the mechanism that synchronizes data between the component class and its HTML template.

Types:
1. Interpolation: {{ expression }} — renders component data in the template.
   <h1>Hello {{ username }}</h1>

2. Property Binding: [property]="value" — sets a DOM property from the component.
   <input [value]="name">

3. Event Binding: (event)="handler()" — listens to DOM events.
   <button (click)="save()">Save</button>

4. Two-way Binding: [(ngModel)]="value" — keeps component and template in sync.
   <input [(ngModel)]="username">

Two-way binding = property binding + event binding combined using the "banana in a box" syntax [()].`, "Beginner"),

  q("One-way vs Two-way data binding.",
  `One-way data binding: Data flows in a single direction only.
• Component → Template: Interpolation {{ }}, Property binding [ ]
  <p>{{ title }}</p>  |  <img [src]="imgUrl">
• Template → Component: Event binding ( )
  <button (click)="doSomething()">Click</button>

Two-way data binding: Data flows in BOTH directions simultaneously.
  <input [(ngModel)]="username">
  This is shorthand for: <input [ngModel]="username" (ngModelChange)="username=$event">

When to use:
• One-way is preferred for performance — easier to debug since data flows predictably.
• Two-way is convenient for form inputs where you want the model updated as the user types.

Note: Requires importing FormsModule for ngModel to work.`, "Beginner"),

  q("What is dependency injection in Angular?",
  `Dependency Injection (DI) is a design pattern where a class requests its dependencies from an external source (Angular's injector) rather than creating them itself.

@Injectable({ providedIn: 'root' }) // Registered as singleton in root injector
export class UserService {
  getUser() { return { name: 'Bharat' }; }
}

@Component({...})
export class ProfileComponent {
  constructor(private userService: UserService) {} // Angular injects automatically
  ngOnInit() { this.user = this.userService.getUser(); }
}

Hierarchical Injectors: Angular has a tree of injectors mirroring the component tree. A component can provide a service at its level, creating a new instance local to that component and its children.

Benefits: Decoupling, testability (easy to mock), reusability.`, "Beginner"),

  q("What are services?",
  `A service is a class decorated with @Injectable that encapsulates reusable business logic, data access, or shared state. Services have no view/template.

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}

Why use services?:
• Separation of concerns — keeps components thin.
• Reusability — share logic across multiple components.
• Testability — inject mock services in unit tests.
• State sharing — a root-provided service holds shared state.

Rule: If logic is not about displaying data, move it to a service.`, "Beginner"),

  q("What is RxJS?",
  `RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables to compose asynchronous and event-based code.

Core concepts:
• Observable: A lazy stream that emits values over time. Nothing executes until subscribed.
• Observer: Consumes emitted values via { next, error, complete }.
• Subscription: The execution. Always unsubscribe to avoid memory leaks.
• Operators: Pure functions to transform streams:
  - Creation: of(), from(), interval(), fromEvent()
  - Transformation: map(), switchMap(), mergeMap(), concatMap()
  - Filtering: filter(), debounceTime(), distinctUntilChanged(), takeUntil()
  - Error handling: catchError(), retry(), throwError()
  - Combination: forkJoin(), combineLatest(), zip()

Angular uses RxJS for: HttpClient, Router events, Reactive Forms, EventEmitter, AsyncPipe.`, "Intermediate"),

  q("Observable vs Promise.",
  `Both handle async operations but differ significantly:

| | Observable | Promise |
|---|---|---|
| Values | Multiple over time | Single value |
| Lazy | Yes – executes on subscribe | No – executes immediately |
| Cancellable | Yes – unsubscribe() | No |
| Operators | Rich (map, filter, retry…) | Limited (.then, .catch only) |
| Angular | Native (HttpClient) | Supported but not preferred |

Observable example:
this.http.get('/api/data').pipe(
  retry(3), map(r => r.data), catchError(handleError)
).subscribe(data => this.data = data);

Promise example:
fetch('/api/data').then(r => r.json()).then(d => this.data = d);

Key insight for interviews: Observables are lazy and cancellable — if you navigate away before an HTTP call completes, you can unsubscribe and cancel it. Promises cannot be cancelled.`, "Intermediate"),

  q("What is Subject and BehaviorSubject?",
  `A Subject is both an Observable (can be subscribed to) and an Observer (can emit values).

Subject: No initial value. Late subscribers miss previous emissions.
const subject = new Subject<number>();
subject.next(1); // emitted before subscribe — MISSED
subject.subscribe(v => console.log(v)); // only gets future values
subject.next(2); // subscriber gets: 2

BehaviorSubject: Requires an initial value. New subscribers immediately receive the LATEST value.
const bs = new BehaviorSubject<number>(0);
bs.next(1);
bs.subscribe(v => console.log(v)); // immediately gets: 1 (latest)
bs.next(2); // gets: 2

Other variants:
• ReplaySubject(n): Replays the last n emissions to late subscribers.
• AsyncSubject: Only emits the last value on completion.

Interview verdict: BehaviorSubject is the most used — perfect for sharing current state (logged-in user, theme, cart count) across components.`, "Intermediate"),

  q("What is HttpClient?",
  `HttpClient is Angular's built-in module for making HTTP requests. It returns Observables.

Setup (standalone): provideHttpClient() in bootstrapApplication providers.
Setup (NgModule): import HttpClientModule in AppModule.

Usage:
constructor(private http: HttpClient) {}

// GET
this.http.get<User[]>('/api/users').subscribe(users => this.users = users);

// POST
this.http.post('/api/users', { name: 'Bharat' }).subscribe();

// With options (headers, params):
this.http.get('/api/data', {
  headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }),
  params: new HttpParams().set('page', '1')
}).subscribe();

Features: Type safety via generics, automatic JSON parsing, interceptors, progress events, and error handling via pipe(catchError(...)).`, "Intermediate"),

  q("What is Interceptor?",
  `An HTTP Interceptor is middleware that intercepts every outgoing request and incoming response.

Common uses: Auth token injection, logging, error handling, loading spinner, caching.

Modern functional interceptor (Angular 15+):
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = req.clone({
    setHeaders: { Authorization: 'Bearer ' + token }
  });
  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) inject(Router).navigate(['/login']);
      return throwError(() => err);
    })
  );
};

// Registration:
provideHttpClient(withInterceptors([authInterceptor]))

Interceptors execute in registration order — outermost first on request, last on response.`, "Intermediate"),

  q("What is Routing and Lazy Loading?",
  `Routing maps URL paths to components. Angular's Router handles navigation without page reloads.

Basic setup:
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: '**', component: NotFoundComponent } // wildcard
];

Lazy Loading: Loads a module/component only when its route is visited — reduces initial bundle size.
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
}

// Standalone (Angular 14+):
{
  path: 'settings',
  loadComponent: () => import('./settings.component').then(c => c.SettingsComponent)
}

Use PreloadAllModules strategy to download lazy modules in the background after initial load.`, "Intermediate"),

  q("What is Guard in Angular?",
  `Route Guards are functions (or classes) that control whether navigation to/from a route is allowed.

Types:
• canActivate — can the user visit this route? (auth check)
• canActivateChild — guard child routes
• canDeactivate — can user leave? (unsaved changes warning)
• canMatch — should this route be considered at all?
• resolve — pre-fetch data before route activates

Modern functional guard (Angular 15+):
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() 
    ? true 
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Apply in route:
{ path: 'admin', canActivate: [authGuard], component: AdminComponent }`, "Intermediate"),

  q("What is Resolver?",
  `A Resolver pre-fetches data BEFORE a route is activated, ensuring the component receives data immediately on load without a loading spinner.

Modern functional resolver (Angular 15+):
export const userResolver: ResolveFn<User> = (route, state) => {
  return inject(UserService).getUserById(route.paramMap.get('id')!);
};

// Route config:
{
  path: 'user/:id',
  resolve: { user: userResolver },
  component: UserDetailComponent
}

// Access resolved data in component:
export class UserDetailComponent {
  user = inject(ActivatedRoute).snapshot.data['user'];
}

When to use: When the component MUST have data to render correctly (e.g., edit form — prefill with existing data).
When NOT to use: If showing a skeleton/loading state is acceptable — resolver blocks navigation until data arrives.`, "Intermediate"),

  q("What is Pipe?",
  `A Pipe transforms data in templates using the | character.

{{ amount | currency:'INR':'symbol':'1.2-2' }}
{{ date | date:'dd MMM yyyy' }}
{{ name | uppercase }}

Built-in pipes: date, currency, number, percent, uppercase, lowercase, titlecase, json, async, slice, keyvalue.

Custom pipe:
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, ellipsis = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.slice(0, limit) + ellipsis : value;
  }
}

// Usage: {{ description | truncate:100 }}

Pipes are preferable over calling methods in templates — methods are called on every CD cycle, pure pipes are cached.`, "Intermediate"),

  q("Pure vs Impure Pipes.",
  `Pure Pipe (default — pure: true):
• Re-executes ONLY when the input reference changes (primitive value change or new object/array reference).
• Cached — Angular does not re-run if input hasn't changed.
• Efficient and recommended for most cases.

Impure Pipe (pure: false):
• Re-executes on EVERY change detection cycle regardless of input.
• Use when the output can change even if input reference stays the same (e.g., filtering a mutated array).

@Pipe({ name: 'filterByStatus', pure: false })
export class FilterByStatusPipe implements PipeTransform {
  transform(items: any[], status: string): any[] {
    return items.filter(i => i.status === status);
  }
}

Warning: Impure pipes can cause severe performance issues in large lists. Prefer immutable data + pure pipes, or filter in the component class.`, "Intermediate"),

  q("What is Change Detection?",
  `Change Detection (CD) is Angular's mechanism for keeping the DOM in sync with component data.

How it works:
1. Zone.js patches all async APIs (click, setTimeout, XHR, promises).
2. When any async event completes, Zone.js notifies Angular.
3. Angular traverses the component tree top-to-bottom, checking every component's template for changes.
4. If data changed, Angular updates the DOM.

Two strategies:
• Default: Every component is checked on every event. Simple but can be slow for large trees.
• OnPush: A component is only checked when its @Input() references change, or an event originates from it, or markForCheck() is called.

Angular 16+ Signals bypass CD entirely — signal updates trigger precise DOM updates without traversing the tree.`, "Intermediate"),

  q("Default vs OnPush strategy.",
  `Default Strategy (ChangeDetectionStrategy.Default):
• Angular checks the ENTIRE component tree on every browser event.
• Safe — guaranteed to detect all changes.
• Can become slow with many components or frequent events.

OnPush Strategy (ChangeDetectionStrategy.OnPush):
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
• Angular SKIPS this component unless:
  1. An @Input() reference changes (not mutation — use immutable updates).
  2. An Observable via AsyncPipe emits.
  3. An event originates from this component.
  4. markForCheck() or detectChanges() is called manually.

Best practice:
• Use OnPush for ALL presentational/dumb components.
• Combine with immutable objects (spread operator, Array.map) and the AsyncPipe.
• This can reduce CD runs by 80%+ in large apps.`, "Intermediate"),

  q("What is Zone.js?",
  `Zone.js is a library that monkey-patches (overrides) browser async APIs so Angular knows when to run change detection.

Patched APIs: setTimeout, setInterval, Promise.then, addEventListener, XHR, etc.

How it works:
1. You click a button → Zone.js intercepts the event.
2. Your handler runs, possibly updating data.
3. Zone.js signals Angular that the zone is stable.
4. Angular runs change detection.

Problems with Zone.js:
• Overhead: Wrapping every async operation adds latency.
• Unexpected CD: A third-party library using setTimeout triggers unnecessary CD.
• Debugging: Hard to trace which async call triggered CD.

Zoneless Angular (Angular 18+):
bootstrapApplication(App, { providers: [provideZonelessChangeDetection()] })

In zoneless mode, only Signals and explicit markForCheck() trigger CD. Far more performant.`, "Intermediate"),

  q("What is ViewChild?",
  `@ViewChild gives access to a child component, directive, or DOM element from a component's OWN template.

// Access a DOM element:
@ViewChild('myInput') inputEl: ElementRef;

// Access a child component:
@ViewChild(ModalComponent) modal: ModalComponent;

// Available from:
ngAfterViewInit() {
  this.inputEl.nativeElement.focus();
  this.modal.open();
}

// { static: true }: available from ngOnInit (for elements not inside *ngIf/*ngFor)
@ViewChild('btn', { static: true }) btn: ElementRef;

@ViewChildren: Returns a QueryList of ALL matching elements.
@ViewChildren(ListItemComponent) items: QueryList<ListItemComponent>;

Common mistake: Accessing @ViewChild in ngOnInit — it's undefined because the view hasn't initialized yet. Always use ngAfterViewInit.`, "Intermediate"),

  q("What is ContentChild?",
  `@ContentChild gives access to elements projected into a component via <ng-content>, accessed from the PARENT's template.

// card.component.ts
@ContentChild(CardHeaderDirective) header: CardHeaderDirective;

ngAfterContentInit() {
  console.log(this.header); // available here
}

// parent template:
<app-card>
  <app-card-header>My Title</app-card-header> // ← this is content
</app-card>

Difference from @ViewChild:
| | @ViewChild | @ContentChild |
|---|---|---|
| Source | Component's own template | Projected content (ng-content) |
| Available | ngAfterViewInit | ngAfterContentInit |

@ContentChildren: Returns QueryList of all matching projected content.
Used heavily in reusable component libraries (tabs, accordions, dropdowns).`, "Intermediate"),

  q("What is Template-driven form?",
  `Template-driven forms define form logic in the HTML template using Angular directives.

<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
  <input name="email" [(ngModel)]="user.email" required email #email="ngModel">
  <span *ngIf="email.invalid && email.touched">Invalid email</span>
  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>

// Component class — minimal:
onSubmit(form: NgForm) {
  if (form.valid) console.log(form.value);
}

Pros: Simple, quick to build, less code for simple forms.
Cons:
• Async — form controls are created by directives, not immediately available.
• Hard to unit test.
• Limited control for complex dynamic forms.
• Validation logic is scattered in the template.

Requires: FormsModule import.`, "Intermediate"),
];

// Part 2 — questions 26-50
const questions2 = [
  q("What is Reactive Form?",
  `Reactive forms define the form model in the TypeScript class. More powerful and testable.

export class RegisterComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    address: new FormGroup({
      city: new FormControl('', Validators.required)
    })
  });

  onSubmit() {
    if (this.form.valid) console.log(this.form.value);
  }
}

Template:
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  <span *ngIf="form.get('email')?.hasError('email')">Invalid email</span>
</form>

Pros: Synchronous, fully testable, dynamic form generation, easy to track state.
Requires: ReactiveFormsModule import.`, "Intermediate"),

  q("Form Validation techniques.",
  `Angular provides built-in and custom validation for both form types.

Built-in Validators (Reactive Forms):
new FormControl('', [
  Validators.required,
  Validators.email,
  Validators.minLength(8),
  Validators.maxLength(100),
  Validators.pattern(/^[a-zA-Z]+$/)
])

Template-driven (directive-based):
<input required email minlength="8" [(ngModel)]="email">

Accessing validation state:
form.get('email')?.invalid  // boolean
form.get('email')?.errors   // { required: true } | null
form.get('email')?.touched  // user has interacted

Show error:
<span *ngIf="form.get('email')?.hasError('required') && form.get('email')?.touched">
  Email is required
</span>

Cross-field validation: Use group-level validators to compare multiple fields (e.g., password match).`, "Intermediate"),

  q("Custom Validator.",
  `Custom validators are functions that return null (valid) or an error object (invalid).

Sync validator:
export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasSpace = (control.value as string)?.includes(' ');
    return hasSpace ? { noSpaces: true } : null;
  };
}

// Usage:
new FormControl('', [Validators.required, noSpacesValidator()])

// Template — check for error key:
<span *ngIf="form.get('username')?.hasError('noSpaces')">No spaces allowed</span>

Cross-field validator (FormGroup level):
export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

new FormGroup({ password: ..., confirmPassword: ... }, { validators: passwordMatchValidator })`, "Advanced"),

  q("What is Async Validator?",
  `Async validators run asynchronous checks (e.g., check if username is taken via API).

export function uniqueUsernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(400).pipe( // debounce to avoid API calls on every keystroke
      switchMap(() => userService.checkUsername(control.value)),
      map(isTaken => isTaken ? { usernameTaken: true } : null),
      catchError(() => of(null)) // assume valid on error
    );
  };
}

// Usage (3rd argument to FormControl):
new FormControl('', [Validators.required], [uniqueUsernameValidator(userService)])

Pending state: form.get('username')?.pending === true while async validation is running.
Show spinner: <span *ngIf="form.get('username')?.pending">Checking...</span>

Key: Async validators are in the THIRD argument array of FormControl. They run AFTER sync validators pass.`, "Advanced"),

  q("What is State Management?",
  `State management is how you store, access, and update shared application data across components.

Types of state:
• Local state: Belongs to a single component (UI toggles, form input). Use component class variables + Signals.
• Shared state: Used by multiple unrelated components (logged-in user, cart). Use services with BehaviorSubject or Signals.
• Server state: Data fetched from an API. Use RxJS + HttpClient with caching strategies.
• URL state: State reflected in the URL. Use Angular Router + queryParams.

Options for shared state:
1. Service + BehaviorSubject: Simple and effective for most apps.
2. Angular Signals: Modern, fine-grained reactivity without RxJS.
3. NgRx: Redux-inspired, for large apps with complex state transitions.
4. NGXS / Akita: Alternative state management libraries.

Interview tip: Don't jump to NgRx for every app — overcomplicated for small/medium apps. Start with services + Signals.`, "Advanced"),

  q("What is NgRx?",
  `NgRx is Angular's implementation of the Redux pattern for predictable state management using RxJS.

Core principles:
• Single source of truth — one immutable state tree (the Store).
• State is read-only — only changed via Actions and Reducers.
• Changes are pure functions — Reducers are pure functions with no side effects.

Flow: Component dispatches Action → Reducer updates State → Store emits new State → Component receives via selector.

When to use NgRx:
• Large team — explicit state transitions prevent bugs.
• Complex inter-component state dependencies.
• Time-travel debugging needed.
• Server state caching with NgRx Entity/Data.

When NOT to use:
• Small/medium apps — services + BehaviorSubject or Signals are simpler and sufficient.

NgRx boilerplate is significant. Angular community increasingly uses lighter alternatives like Signals + services.`, "Advanced"),

  q("What is Store, Action, Reducer, Effect?",
  `These are the 4 pillars of NgRx:

ACTION: A plain object describing what happened.
export const login = createAction('[Auth] Login', props<{ email: string }>());

REDUCER: A pure function that takes current state + action, returns new state (no mutation).
const authReducer = createReducer(initialState,
  on(login, (state, { email }) => ({ ...state, email, isLoggedIn: true }))
);

STORE: The single immutable state tree. Components read from it via selectors.
this.store.dispatch(login({ email: 'user@example.com' }));
this.user$ = this.store.select(selectCurrentUser);

EFFECT: Handles side effects (API calls, localStorage, navigation) triggered by actions.
loginEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(login),
    switchMap(action => this.authService.login(action.email).pipe(
      map(user => loginSuccess({ user })),
      catchError(err => of(loginFailure({ error: err.message })))
    ))
  )
);`, "Advanced"),

  q("What is SSR (Angular Universal)?",
  `Server-Side Rendering (SSR) renders Angular on the server and sends HTML to the browser.
Now built into Angular as @angular/ssr (Angular 17+).

Benefits:
• SEO — search engines receive fully rendered HTML.
• Faster FCP/LCP — browser displays content before JavaScript boots.
• Better UX on slow devices/networks.

How it works:
1. Node.js server (Express) bootstraps Angular and renders component tree to HTML string.
2. Client receives full HTML — displays immediately.
3. Angular boots in the browser and hydrates the DOM (reuses existing nodes, Angular 16+).

Caveats:
• Avoid browser-only APIs (window, document, localStorage) in server-rendered code.
• Use isPlatformBrowser(this.platformId) guard:
  if (isPlatformBrowser(this.platformId)) { localStorage.setItem('key', 'val'); }

Setup: ng add @angular/ssr`, "Advanced"),

  q("What is AOT compilation?",
  `AOT (Ahead-of-Time) compilation converts Angular HTML templates and TypeScript code into efficient JavaScript BEFORE the browser downloads and runs it.

Without AOT (JIT): The browser downloads the Angular compiler (~500KB) and compiles templates at runtime.

With AOT:
• Compilation happens on the server during ng build.
• The browser receives pre-compiled JavaScript — no compiler needed client-side.
• Smaller bundle, faster startup, errors caught at build time.

ng build uses AOT by default.

Template errors caught at AOT build time:
<!-- This fails at BUILD time with AOT, at RUNTIME with JIT -->
<h1>{{ user.invalidProp }}</h1>

Angular 9+ uses the Ivy compiler for AOT — produces much smaller bundles via tree-shaking and generates more debuggable output.`, "Advanced"),

  q("AOT vs JIT.",
  `| Aspect | JIT (Just-in-Time) | AOT (Ahead-of-Time) |
|---|---|---|
| When compiled | In the browser at runtime | During build on the server |
| Bundle size | Larger (includes compiler) | Smaller (no compiler shipped) |
| Startup speed | Slower | Faster |
| Error detection | Runtime | Build time |
| Use case | Development (ng serve) | Production (ng build) |
| Security | Template source exposed | Templates compiled, not exposed |

AOT is enabled by default for ng build. JIT is used during ng serve for faster rebuilds.

Interview tip: AOT catches template binding errors at build time — this is a major DX advantage, preventing runtime surprises in production.`, "Advanced"),

  q("What is Ivy renderer?",
  `Ivy is Angular's current compilation and rendering pipeline (default since Angular 9).

What Ivy improved over the old View Engine:
• Smaller bundle: Unused Angular features are tree-shaken out.
• Faster compilation: Incremental compilation — only recompile changed files.
• Locality: Each component is compiled independently — no global analysis needed.
• Better debugging: Components visible as classes in DevTools call stacks.
• Dynamic component loading: Simplified and faster.
• Lazy loading: More granular — standalone components lazy-load without modules.
• Better tree-shaking: Dead code elimination is far more effective.

Ivy is what makes Standalone Components and Signal-based components possible. It laid the groundwork for the modern Angular renaissance.`, "Advanced"),

  q("What is Tree Shaking?",
  `Tree shaking is a build optimization that removes unused code from the final bundle.

How it works:
1. Webpack/esbuild analyzes the import/export graph (ES Modules).
2. Any code that is imported but never actually used is marked as "dead code."
3. Dead code is excluded from the final bundle.

In Angular:
• AOT + Ivy enables aggressive tree-shaking of Angular itself — only the framework features you use are bundled.
• Example: If you never use HttpClient, it's shaken out.
• Standalone components enable better tree-shaking than NgModules.

Best practices for tree-shaking:
• Use ES modules (import/export), not CommonJS (require).
• Import from specific paths: import { map } from 'rxjs/operators' vs import * as Rx from 'rxjs'.
• Avoid side-effect imports where possible.`, "Advanced"),

  q("What is Webpack?",
  `Webpack is a module bundler that Angular CLI uses internally to bundle your app for the browser.

What Webpack does for Angular:
1. Dependency graph: Starting from main.ts, traces all imports recursively.
2. Bundling: Combines all modules into output chunks (main.js, vendor.js, lazy chunks).
3. Code splitting: Splits lazy-loaded routes into separate chunks automatically.
4. Loaders: Transforms TypeScript (via ts-loader), SCSS, HTML into JavaScript.
5. Plugins: DefinePlugin (env vars), HtmlWebpackPlugin, MiniCssExtractPlugin.
6. Tree shaking (production mode)
7. Minification + source maps

Angular CLI abstracts Webpack — you rarely configure it directly. For advanced cases, use custom-webpack builder.

Angular 17+ also supports esbuild as an alternative bundler, offering significantly faster build times.`, "Advanced"),

  q("How to optimize Angular performance?",
  `Comprehensive Angular performance optimization checklist:

1. OnPush Change Detection — check components only when needed.
2. Signals (Angular 16+) — fine-grained reactivity, eliminate Zone.js overhead.
3. Lazy Loading routes — loadChildren/loadComponent to split bundles.
4. trackBy in *ngFor — avoid re-rendering unchanged list items.
5. Pure Pipes — computed and cached until input changes.
6. AsyncPipe — auto-subscribes/unsubscribes, triggers OnPush correctly.
7. Virtual Scrolling (CDK) — render only visible rows in large lists.
8. Preloading Strategy — preload lazy routes after initial load.
9. NgOptimizedImage — automatic lazy loading, srcset, priority hints.
10. Zoneless Angular — eliminate Zone.js overhead entirely.
11. Bundle analysis — webpack-bundle-analyzer to find bloat.
12. Avoid function calls in templates — use pipes or memoization instead.
13. Unsubscribe properly — takeUntilDestroyed(), AsyncPipe, or DestroyRef.
14. HTTP caching — cache API responses with shareReplay(1).
15. Server-Side Rendering + Hydration for perceived performance.`, "Advanced"),

  q("How to handle large lists (virtual scroll)?",
  `Rendering thousands of DOM nodes destroys performance. Virtual scrolling only renders visible items.

Angular CDK Virtual Scroll:
// Install: npm i @angular/cdk
// Import: ScrollingModule

<cdk-virtual-scroll-viewport itemSize="60" class="viewport">
  <div *cdkVirtualFor="let item of items; trackBy: trackById" class="item">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>

.viewport { height: 600px; overflow-y: auto; }
.item { height: 60px; }

itemSize: Fixed height of each item in pixels (required for fixed-size strategy).

For variable-height items, use AutoSizeVirtualScrollStrategy from @angular/cdk-experimental.

DataSource: For very large datasets, implement DataSource interface to load data in chunks as the user scrolls (infinite scroll pattern) rather than loading all data at once.

Interview: Always mention trackBy alongside virtual scrolling for maximum performance.`, "Advanced"),

  q("What is TrackBy?",
  `trackBy is a performance optimization for *ngFor that tells Angular how to uniquely identify each item.

Without trackBy:
• When the array changes (add/remove/reorder), Angular destroys and re-creates ALL DOM nodes.

With trackBy:
• Angular checks the track key — only nodes with changed keys are re-created.
• Drastically reduces DOM operations.

// Component:
trackById(index: number, item: Product): number {
  return item.id; // unique identifier
}

// Template:
<li *ngFor="let item of products; trackBy: trackById">{{ item.name }}</li>

Impact: In a 1000-item list where only 3 items change, without trackBy: 1000 DOM nodes destroyed and re-created. With trackBy: only 3 DOM nodes updated.

Rule: Always use trackBy for lists with dynamic data.`, "Intermediate"),

  q("What is Dynamic Component Loading?",
  `Dynamic Component Loading creates and inserts components at runtime (not hardcoded in templates).

Use cases: Modals, toasts, wizard steps, dynamic forms, plugin systems.

Modern approach with ViewContainerRef (Angular 13+):
@Component({...})
export class HostComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  loadDialog() {
    this.container.clear();
    const ref = this.container.createComponent(DialogComponent);
    ref.instance.title = 'Hello'; // pass inputs
    ref.instance.closed.subscribe(() => ref.destroy()); // listen to outputs
  }
}

// Template:
<ng-template #container></ng-template>

Angular 14+: inject() + createComponent() without ComponentFactoryResolver (deprecated).

Signal inputs work the same way — set() the signal after creating the component.`, "Advanced"),

  q("What is Custom Directive?",
  `A directive adds behavior to an existing DOM element without creating a new component.

Attribute Directive (modifies element appearance/behavior):
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appHighlight);
  }

  @HostListener('mouseleave') onLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
  }
}

// Usage: <p appHighlight="lightblue">Hover me</p>

Best practices:
• Use Renderer2 instead of direct DOM manipulation — works with SSR.
• Use @HostBinding for property bindings and @HostListener for event listening.`, "Advanced"),

  q("Structural vs Attribute Directive.",
  `Structural Directives: Change the DOM structure by adding or removing elements.
• Prefixed with * (syntactic sugar for ng-template).
• Built-in: *ngIf, *ngFor, *ngSwitch.
• The * expands to: <ng-template [ngIf]="condition"><div>...</div></ng-template>

Custom structural directive:
@Directive({ selector: '[appRepeat]' })
export class RepeatDirective {
  constructor(private vcr: ViewContainerRef, private tmpl: TemplateRef<any>) {}
  @Input() set appRepeat(times: number) {
    this.vcr.clear();
    for (let i = 0; i < times; i++) this.vcr.createEmbeddedView(this.tmpl, { $implicit: i });
  }
}
// Usage: <div *appRepeat="3; let i">Item {{ i }}</div>

Attribute Directives: Modify the appearance or behavior of an existing element without changing the DOM structure.
• Built-in: ngClass, ngStyle, ngModel.
• Custom: HighlightDirective, AutofocusDirective, ClickOutsideDirective.`, "Advanced"),

  q("What is ngTemplate and ngContainer?",
  `ng-template: Defines a reusable template block that is NOT rendered by default. Angular renders it only when explicitly instructed.

<ng-template #loadingTpl>
  <div class="spinner">Loading...</div>
</ng-template>

<div *ngIf="data; else loadingTpl">{{ data }}</div>

// Render manually with ngTemplateOutlet:
<ng-container *ngTemplateOutlet="loadingTpl"></ng-container>

ng-container: A logical grouping element that renders its children WITHOUT adding any extra DOM node. Solves the "can't use two structural directives on one element" problem.

// WRONG — can't use *ngIf and *ngFor on same element:
<li *ngFor="let item of items" *ngIf="item.active">{{ item.name }}</li>

// CORRECT — use ng-container:
<ng-container *ngFor="let item of items">
  <li *ngIf="item.active">{{ item.name }}</li>
</ng-container>`, "Advanced"),

  q("What is ViewEncapsulation?",
  `ViewEncapsulation controls how component styles are scoped to prevent them from leaking to/from other components.

Three modes:

1. Emulated (default): Angular adds unique attribute selectors to all styles.
   .title[_ngcontent-abc-c1] { color: red; } — styles stay scoped.

2. None: No encapsulation. Styles become global and affect all components.
   Use for intentional global styles or third-party library overrides.

3. ShadowDom: Uses the browser's native Shadow DOM. True isolation.
   Styles cannot leak in or out. Good for Web Components / design systems.

@Component({
  encapsulation: ViewEncapsulation.None, // or .ShadowDom, .Emulated
  ...
})

Tip: Use ::ng-deep (with caution) to pierce Emulated encapsulation and style child components. Mark as deprecated in your codebase and prefer ViewEncapsulation.None on a wrapper element when needed.`, "Advanced"),

  q("What is Shadow DOM?",
  `The Shadow DOM is a browser native feature that encapsulates a component's internal DOM and styles, isolating them from the rest of the document.

Why it matters for Angular:
• ViewEncapsulation.ShadowDom enables true Shadow DOM isolation.
• Styles inside a Shadow DOM cannot leak out; external styles cannot bleed in.
• Used for building truly portable Web Components.

How Angular uses it:
@Component({
  selector: 'my-button',
  encapsulation: ViewEncapsulation.ShadowDom,
  template: '<button class="btn">Click</button>',
  styles: ['.btn { background: #6366f1; }'] // isolated, won't affect external .btn
})

Emulated vs ShadowDom:
• Emulated: Angular simulates scope with attribute selectors — works in all browsers, most common.
• ShadowDom: Uses real browser API — true isolation but may have CSS custom property limitations.

Angular's default (Emulated) is sufficient for 99% of apps.`, "Advanced"),

  q("What is PWA in Angular?",
  `A Progressive Web App (PWA) is a web app that uses modern browser APIs to provide native app-like experiences: offline support, install to home screen, push notifications.

Setup:
ng add @angular/pwa

This generates:
• ngsw-config.json — Service Worker configuration.
• manifest.webmanifest — App identity (name, icons, theme colors).
• Registers ServiceWorkerModule in AppModule.

Key features added:
• Service Worker: Background script that intercepts network requests, enabling offline caching strategies.
• App Shell: Instant first paint with cached shell HTML.
• Push Notifications: Via the Web Push API + service worker.
• Install prompt: Browser shows "Add to Home Screen" based on manifest criteria.

Cache strategies in ngsw-config.json:
• performance: Serve from cache first, update in background.
• freshness: Network first, fallback to cache.

ng build --configuration=production required to fully activate the service worker.`, "Advanced"),

  q("How to secure Angular app?",
  `Angular has built-in security features but you must follow best practices:

1. XSS prevention (built-in): Angular sanitizes all template expressions by default. Never use innerHTML, document.write(), or bypassSecurityTrust* unless absolutely necessary.

2. CSRF protection: Angular's HttpClient reads the XSRF-TOKEN cookie and sends it as X-XSRF-TOKEN header automatically.

3. Route Guards: Protect routes with canActivate guards — verify JWT/session before granting access.

4. JWT handling: Store JWT in memory (not localStorage — XSS risk) or httpOnly cookies (CSRF risk). Use short-lived tokens + refresh tokens.

5. Content Security Policy (CSP): Configure HTTP headers to restrict script sources.

6. HTTPS: Always serve Angular apps over HTTPS.

7. Dependency audit: npm audit to find vulnerable packages.

8. Role-based access: Implement RBAC in guards — check user roles, not just login status.

9. API security: Never do authorization logic client-side only — always validate on the server.

10. Sanitize user input: Use Angular's DomSanitizer when dealing with dynamic HTML.`, "Advanced"),

  q("How to deploy Angular application?",
  `Angular deployment steps:

1. Build for production:
ng build --configuration=production
Output goes to dist/your-app/browser/

Optimizations applied: AOT, minification, tree-shaking, dead code elimination, file hashing.

2. Deployment targets:

Static hosting (SPA):
• Netlify: drag-drop the dist folder or connect GitHub.
• Vercel: ng build + vercel deploy.
• Firebase Hosting: ng add @angular/fire → firebase deploy.
• GitHub Pages: ng deploy with @angular-builders/github-pages.
• AWS S3 + CloudFront: Upload dist to S3, configure CloudFront.
• Nginx: Copy dist to /usr/share/nginx/html, configure for HTML5 routing.

CRITICAL Nginx config for deep linking:
location / {
  try_files $uri $uri/ /index.html;
}
Without this, refreshing on /dashboard gives 404.

SSR deployment:
Docker container running Node.js Express server.
deploy to AWS ECS, Google Cloud Run, or Azure App Service.`, "Advanced"),
];

const allQuestions = [...questions, ...questions2];

console.log(`Seeding ${allQuestions.length} Angular questions into MongoDB...`);

const seedDB = async () => {
  try {
    // Wait for DB connection
    await mongoose.connection.asPromise();

    // Clear existing Angular questions
    const existingQuestions = await Question.find({ category: 'Angular' });
    const existingIds = existingQuestions.map(q => q._id);
    
    await Interaction.deleteMany({ question_id: { $in: existingIds } });
    await Question.deleteMany({ category: 'Angular' });
    console.log('Cleared existing Angular questions.');

    let seeded = 0;
    for (const qData of allQuestions) {
      const q = new Question({
        question: qData.question,
        answer: qData.answer,
        category: qData.category,
        difficulty: qData.difficulty
      });
      await q.save();
      
      const i = new Interaction({ question_id: q._id });
      await i.save();
      
      seeded++;
    }

    const beg = allQuestions.filter(x => x.difficulty === 'Beginner').length;
    const mid = allQuestions.filter(x => x.difficulty === 'Intermediate').length;
    const adv = allQuestions.filter(x => x.difficulty === 'Advanced').length;
    console.log(`\n✅ Seeded ${seeded} Angular questions into MongoDB:`);
    console.log(`   Beginner: ${beg}  Intermediate: ${mid}  Advanced: ${adv}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

mongoose.connection.once('connected', seedDB);
