const db = require('./db/database');

const angularQuestions = [

  // ─── BEGINNER ───────────────────────────────────────────────────────────────

  {
    question: "What is Angular and how is it different from AngularJS?",
    answer: `Angular (v2+) is a complete rewrite of AngularJS built with TypeScript. Key differences:
• Language: Angular uses TypeScript; AngularJS uses JavaScript.
• Architecture: Angular uses a component-based architecture; AngularJS uses MVC with $scope.
• Mobile: Angular is optimized for mobile-first; AngularJS was desktop-first.
• Performance: Angular uses Ahead-of-Time (AOT) compilation and a unidirectional data flow, making it significantly faster.
• Dependency Injection: Angular has a hierarchical DI system; AngularJS had a flat DI system.
• CLI: Angular ships with a powerful CLI; AngularJS had no official build tooling.`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What is a Component in Angular?",
    answer: `A Component is the basic building block of Angular UI. It consists of:
• A TypeScript class decorated with @Component
• An HTML template (inline or external)
• A CSS stylesheet (inline or external)
• Metadata (selector, templateUrl, styleUrls)

Example:
@Component({
  selector: 'app-hello',
  template: '<h1>Hello {{name}}</h1>'
})
export class HelloComponent {
  name = 'Angular';
}

The selector defines the custom HTML tag used to instantiate the component in parent templates.`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What are Angular Modules (NgModule)?",
    answer: `An NgModule is a container for a cohesive block of code. It groups components, directives, pipes, and services.

Key decorators in @NgModule:
• declarations: Components, directives, pipes that belong to this module.
• imports: Other modules whose exported classes are needed.
• exports: Subset of declarations that other modules can use.
• providers: Services available to the whole app (if root module).
• bootstrap: The root component that Angular creates and inserts into the index.html.

Angular 14+ introduced Standalone Components which can reduce reliance on NgModules.`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What is Data Binding in Angular? Explain its types.",
    answer: `Data binding synchronizes data between the component class and its template.

Types:
1. Interpolation {{ }} — One-way, class → template. e.g., <p>{{ title }}</p>
2. Property Binding [ ] — One-way, class → DOM property. e.g., <img [src]="imgUrl">
3. Event Binding ( ) — One-way, DOM → class. e.g., <button (click)="save()">
4. Two-way Binding [( )] — Bidirectional sync using ngModel. e.g., <input [(ngModel)]="name">

Two-way binding is syntactic sugar for combining property + event binding: [ngModel] + (ngModelChange).`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What is the difference between ngIf and ngSwitch?",
    answer: `Both are structural directives that conditionally render DOM elements.

*ngIf: Adds or removes a single element/block based on a boolean expression.
<div *ngIf="isLoggedIn">Welcome!</div>
<div *ngIf="isLoggedIn; else loginTemplate">Welcome!</div>

*ngSwitch: Useful when you have multiple mutually exclusive conditions (like a switch statement).
<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Admin Panel</p>
  <p *ngSwitchCase="'user'">Dashboard</p>
  <p *ngSwitchDefault>Guest</p>
</div>

Use *ngIf for simple show/hide; use *ngSwitch for multiple branches on the same variable.`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What is the Angular CLI and why is it important?",
    answer: `The Angular CLI (Command Line Interface) is a powerful toolchain for Angular development.

Key commands:
• ng new my-app — scaffold a new project
• ng generate component header — create components, services, pipes, etc.
• ng serve — run a local dev server with hot reload
• ng build --configuration=production — build optimized production bundle
• ng test — run unit tests via Karma
• ng e2e — run end-to-end tests

Why it matters: Enforces project structure conventions, automates boilerplate, integrates with Webpack/esbuild, and handles environment configurations.`,
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "What is *ngFor and how do you use trackBy?",
    answer: `*ngFor is a structural directive that renders a template for each item in a collection.

<li *ngFor="let item of items; index as i">{{ i }}: {{ item.name }}</li>

trackBy: A performance optimization. By default, Angular re-renders ALL list items when the array changes. With trackBy, Angular tracks items by a unique key (like id) and only re-renders items that actually changed.

// In component:
trackByFn(index: number, item: any): number {
  return item.id;
}

// In template:
<li *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</li>

This is crucial for large lists and interview questions frequently ask about it.`,
    category: "Angular",
    difficulty: "Beginner"
  },

  // ─── INTERMEDIATE ───────────────────────────────────────────────────────────

  {
    question: "Explain Angular's Dependency Injection (DI) system.",
    answer: `Angular's DI is a design pattern where a class declares its dependencies in the constructor, and Angular's injector provides them at runtime.

Providers tell the injector how to create the dependency:
• providedIn: 'root' — singleton across the entire app (preferred)
• providedIn: SomeModule — scoped to that module
• Component-level providers — new instance per component

@Injectable({ providedIn: 'root' })
export class AuthService { ... }

@Component({...})
export class LoginComponent {
  constructor(private authService: AuthService) {} // Injected automatically
}

Hierarchical injection: Angular has a hierarchy of injectors (root → module → component). A child injector can override a parent provider, creating a new instance scoped to that subtree.`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is the difference between a Service and a Component?",
    answer: `Component: Responsible for the UI — managing a view (template) and user interaction. Should be thin, delegating business logic elsewhere.

Service: A class decorated with @Injectable that encapsulates business logic, data fetching, state management, or shared utilities. Has no template. Can be injected into components or other services.

Best practice: Components should only handle presentation logic. Heavy logic like HTTP calls, data transformation, and state should live in services. This makes code testable and reusable.

Real interview tip: If an interviewer says "your component is too fat," they mean you should extract logic into services.`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is RxJS and how is it used in Angular?",
    answer: `RxJS (Reactive Extensions for JavaScript) is a library for composing asynchronous and event-based programs using Observables.

Key concepts:
• Observable: A lazy data stream that emits zero or more values over time.
• Observer: Consumes values from an Observable via .subscribe({ next, error, complete }).
• Operators: Pure functions to transform streams (map, filter, switchMap, debounceTime, catchError, etc.)
• Subject: Both an Observable and an Observer — used for multicasting.

Angular uses RxJS extensively:
• HttpClient returns Observables for HTTP requests.
• EventEmitter extends Subject.
• Router events are Observables.
• AsyncPipe automatically subscribes and unsubscribes in templates.

Common interview pattern: chaining operators to build reactive data pipelines.
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.api.search(query))
).subscribe(results => this.results = results);`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is the difference between switchMap, mergeMap, concatMap, and exhaustMap?",
    answer: `All four are higher-order mapping operators that flatten an Observable of Observables.

• switchMap: Cancels the previous inner Observable when a new one arrives. Best for search/typeahead (latest query wins).
• mergeMap (flatMap): Subscribes to ALL inner Observables concurrently, results can interleave. Best for parallel requests.
• concatMap: Queues inner Observables and subscribes sequentially. Best for order-sensitive operations like form submissions.
• exhaustMap: Ignores new source emissions while the current inner Observable is active. Best for preventing duplicate API calls (e.g., login button).

Memory trick:
- Switch = cancel old, run new
- Merge = run all simultaneously
- Concat = queue them up
- Exhaust = ignore until done`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is Change Detection in Angular and how does it work?",
    answer: `Change Detection (CD) is how Angular decides when to update the DOM to reflect data changes.

Default strategy: Angular checks every component in the component tree from top to bottom on every event (click, setTimeout, XHR response, etc.) using Zone.js which patches async APIs.

ChangeDetectionStrategy.OnPush: Angular only checks a component when:
1. An @Input() reference changes (not mutation).
2. An event originates from the component or its children.
3. An Observable via AsyncPipe emits.
4. CD is triggered manually via ChangeDetectorRef.markForCheck().

OnPush is a critical performance optimization for large apps. Combine it with immutable data (or Signals) for maximum efficiency.

Angular 16+ Signals: A new fine-grained reactivity primitive that replaces Zone.js in signal-based components, making CD even more precise.`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is a Pipe in Angular? Difference between pure and impure pipes?",
    answer: `A Pipe transforms data in templates using the | syntax.
{{ birthday | date:'longDate' }}
{{ price | currency:'INR' }}

Built-in pipes: date, currency, number, percent, uppercase, lowercase, async, json, slice, keyvalue.

Custom pipe:
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}

Pure vs Impure:
• Pure (default): Only re-runs when the input reference changes. Efficient, cached.
• Impure (pure: false): Re-runs on EVERY change detection cycle, even if input hasn't changed. Use only when transformation depends on mutable state (e.g., filtering an array in-place).

Tip: Avoid impure pipes in performance-critical lists.`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is Lazy Loading in Angular and how do you implement it?",
    answer: `Lazy loading loads feature modules on demand rather than upfront, reducing the initial bundle size.

Implementation in routing:
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];

With Standalone Components (Angular 14+):
{
  path: 'profile',
  loadComponent: () =>
    import('./profile/profile.component').then(c => c.ProfileComponent)
}

Benefits:
• Faster initial load time
• Smaller main bundle
• Code splits by route automatically

The Angular CLI automatically creates separate chunks for lazy-loaded routes during build.`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What are Angular Guards and when do you use them?",
    answer: `Route Guards control navigation — they decide if a route can be activated or deactivated.

Types (Angular 15+ uses functional guards):
• canActivate: Can the user enter this route? (Auth check)
• canActivateChild: Can the user enter child routes?
• canDeactivate: Can the user leave this route? (Unsaved changes warning)
• canMatch: Should this route match at all?
• resolve: Pre-fetch data before activating the route.

Modern functional guard (Angular 15+):
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

// Route config:
{ path: 'admin', canActivate: [authGuard], component: AdminComponent }

Interview tip: Know the difference between class-based guards (old) and functional guards (modern best practice).`,
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "What is the difference between Template-driven and Reactive Forms?",
    answer: `Both approaches manage user input, but differ in where the logic lives.

Template-driven Forms:
• Logic defined in the HTML template using directives (ngModel, ngForm, required).
• Simple to set up, good for simple forms.
• Async — form controls are created by directives, not immediately available in the class.

Reactive Forms:
• Logic defined in the TypeScript class using FormGroup, FormControl, FormArray.
• Synchronous — full control in the component class.
• More predictable, testable, and scalable.
• Enables dynamic form generation, custom validators, and complex logic.

this.form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.minLength(8))
});

Interview verdict: Always prefer Reactive Forms for production apps. Template-driven is fine for quick prototypes.`,
    category: "Angular",
    difficulty: "Intermediate"
  },

  // ─── ADVANCED ────────────────────────────────────────────────────────────────

  {
    question: "What are Angular Signals and how do they differ from RxJS?",
    answer: `Signals (introduced in Angular 16, stable in v17) are a fine-grained reactive primitive for synchronous state.

const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5);     // Sets value
count.update(v => v + 1);  // Updates based on current value

Differences from RxJS:
• Signals are synchronous; Observables are async-first.
• Signals are always readable (no subscribe needed); Observables are lazy.
• Signals enable fine-grained change detection without Zone.js.
• Computed signals auto-track their dependencies (like Vue computed).

When to use Signals: Component-level state, derived values, template data.
When to use RxJS: Async operations (HTTP, WebSocket), event streams, complex operator chains.

Angular's Signals + RxJS interop: toSignal(observable$) and toObservable(signal).`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "Explain Angular's Zone.js. What is Zoneless Angular?",
    answer: `Zone.js is a library that patches browser async APIs (setTimeout, Promise, XHR, addEventListener) to notify Angular when async operations complete, triggering change detection automatically.

Problem with Zone.js:
• Overhead from patching every async API.
• Hard to debug — any async call anywhere can trigger CD.
• Large bundle contribution.

Zoneless Angular (Angular 18+):
Allows running Angular without Zone.js using signals and explicit scheduling. You opt in via:
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()]
});

In zoneless mode, change detection only runs when:
• A Signal updates.
• ChangeDetectorRef.markForCheck() is called.
• AsyncPipe emits.

Benefits: Better performance, smaller bundle, easier debugging, and server-side rendering improvements.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "What is Content Projection and how does ng-content work?",
    answer: `Content Projection allows a parent component to inject HTML into a child component's template using <ng-content>.

// card.component.html:
<div class="card">
  <ng-content select="[card-title]"></ng-content>
  <ng-content select="[card-body]"></ng-content>
  <ng-content></ng-content>  <!-- default slot -->
</div>

// Parent usage:
<app-card>
  <h2 card-title>My Title</h2>
  <p card-body>Some content</p>
  <footer>Footer goes in default slot</footer>
</app-card>

Multi-slot projection uses the select attribute (CSS selector).

ngTemplateOutlet: More dynamic alternative that lets you project templates conditionally.

This is fundamental for building reusable UI libraries. Asked heavily in senior Angular interviews.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "What is the difference between ViewChild, ContentChild, ViewChildren, and ContentChildren?",
    answer: `These decorators give access to child elements/components in a component's class.

ViewChild / ViewChildren: Access elements in the component's OWN template.
@ViewChild('myInput') inputRef: ElementRef; // accesses #myInput in template
@ViewChildren(ChildComponent) children: QueryList<ChildComponent>;

ContentChild / ContentChildren: Access elements projected via ng-content from a PARENT.
@ContentChild(CardTitleDirective) title: CardTitleDirective;

Lifecycle timing:
• ViewChild is available from ngAfterViewInit.
• ContentChild is available from ngAfterContentInit.

Common mistake: Trying to access @ViewChild in ngOnInit — it's undefined because the view hasn't been initialized yet.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "How does Angular's HttpClient handle interceptors?",
    answer: `HTTP Interceptors are middleware that intercept every outgoing request and incoming response. Use cases: adding auth tokens, logging, error handling, caching.

Modern functional interceptor (Angular 15+):
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const cloned = req.clone({
    setHeaders: { Authorization: 'Bearer ' + token }
  });
  return next(cloned);
};

// Registration:
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]))
  ]
});

For error handling:
return next(req).pipe(
  catchError(err => {
    if (err.status === 401) inject(Router).navigate(['/login']);
    return throwError(() => err);
  })
);

Interceptors execute in order of registration — outermost interceptor runs first on request, last on response.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "What is Server-Side Rendering (SSR) in Angular and how does Angular Universal work?",
    answer: `Angular Universal (now built into @angular/ssr in Angular 17+) renders Angular apps on the server and sends HTML to the browser instead of an empty shell.

Benefits:
• Better SEO (crawlers receive full HTML).
• Faster First Contentful Paint (FCP) and LCP.
• Better performance on low-powered devices.

How it works:
1. Node.js server (Express/Fastify) bootstraps the Angular app server-side.
2. Angular renders the component tree to a string of HTML.
3. The browser receives fully-rendered HTML immediately.
4. Angular bootstraps in the browser and "hydrates" the static HTML into an interactive app.

Hydration (Angular 16+): Angular re-uses existing DOM nodes instead of destroying and re-creating them — critical for performance.

Caveats: Must avoid browser-only APIs (window, document, localStorage) in code that runs on the server. Use isPlatformBrowser() guard or inject PLATFORM_ID.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "How do you optimize performance in a large Angular application?",
    answer: `A comprehensive performance checklist for large Angular apps:

1. OnPush Change Detection — reduce CD cycles dramatically.
2. Angular Signals — fine-grained reactivity, eliminate Zone.js overhead.
3. Lazy Loading — split code by route using loadChildren/loadComponent.
4. trackBy in *ngFor — prevent unnecessary list re-renders.
5. Pure Pipes — computationally cheap and cached.
6. AsyncPipe — auto-manages Observable subscriptions.
7. Virtual Scrolling (@angular/cdk) — only render visible list items.
8. Preloading strategies — PreloadAllModules or custom selective preloading.
9. Image optimization — NgOptimizedImage for lazy loading, srcset, priority.
10. Bundle analysis — ng build --stats-json + webpack-bundle-analyzer to find bloat.
11. Tree shaking — import only what you use from libraries.
12. Avoid memory leaks — unsubscribe from Observables (takeUntilDestroyed, AsyncPipe).

Interview tip: Always mention OnPush + Signals + Lazy Loading as your three top strategies.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "What is the difference between Standalone Components and NgModule-based architecture?",
    answer: `Standalone Components (introduced in Angular 14, recommended from v17+) remove the need for NgModules by allowing components to declare their own dependencies.

NgModule approach (traditional):
@NgModule({
  declarations: [HeroComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class HeroModule {}

Standalone approach:
@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, ReactiveFormsModule, HeroCardComponent],
  template: '...'
})
export class HeroComponent {}

Benefits of standalone:
• Less boilerplate — no module file needed.
• Better tree-shaking — only imports what's used.
• Easier lazy loading with loadComponent.
• Simpler mental model for new developers.

Migration: You can mix standalone and NgModule components. The Angular CLI provides ng generate –standalone and ng update schematics to automate migration.`,
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "Explain the Angular Compiler: JIT vs AOT.",
    answer: `Angular templates are HTML extended with Angular syntax — they must be compiled to JavaScript before the browser can render them.

JIT (Just-in-Time) — development only:
• Compilation happens IN the browser at runtime.
• Larger bundle (includes compiler).
• Slower startup (compilation happens on load).
• Used automatically with ng serve.

AOT (Ahead-of-Time) — production standard:
• Compilation happens at BUILD TIME on the server/CI.
• Smaller bundle — compiler not shipped to client.
• Faster rendering — browser gets pre-compiled JS.
• Catches template errors at build time, not runtime.
• Enabled by default with ng build.

Ivy (Angular 9+): The current rendering engine. Replaced the older View Engine. Ivy produces much smaller bundles via tree-shaking, provides better debugging, and enables faster compilation with incremental compilation.

Interview key point: AOT + Ivy + tree-shaking is what makes modern Angular bundles competitive with React.`,
    category: "Angular",
    difficulty: "Advanced"
  }
];

console.log(`Seeding ${angularQuestions.length} Angular interview questions...`);

db.serialize(() => {
  let seeded = 0;
  angularQuestions.forEach(q => {
    db.run(
      `INSERT INTO questions (question, answer, category, difficulty) VALUES (?, ?, ?, ?)`,
      [q.question, q.answer, q.category, q.difficulty],
      function(err) {
        if (err) {
          console.error(`Error seeding: "${q.question.slice(0, 40)}..."`, err.message);
        } else {
          seeded++;
          db.run(`INSERT INTO interactions (question_id) VALUES (?)`, [this.lastID]);
          if (seeded === angularQuestions.length) {
            console.log(`\n✅ Successfully seeded ${seeded} Angular questions!`);
            console.log(`   Beginner: ${angularQuestions.filter(q => q.difficulty === 'Beginner').length}`);
            console.log(`   Intermediate: ${angularQuestions.filter(q => q.difficulty === 'Intermediate').length}`);
            console.log(`   Advanced: ${angularQuestions.filter(q => q.difficulty === 'Advanced').length}`);
            db.close();
          }
        }
      }
    );
  });
});
