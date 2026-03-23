const db = require('./db/database');

const seedData = [
  {
    question: "What is the difference between 'let', 'const', and 'var'?",
    answer: "1. 'var' is function-scoped and can be re-declared and updated. It's hoisted with 'undefined'.\n2. 'let' is block-scoped, can be updated but not re-declared in the same block. It's hoisted but in a temporal dead zone.\n3. 'const' is block-scoped, cannot be updated or re-declared. It must be initialized during declaration.",
    category: "JavaScript",
    difficulty: "Beginner"
  },
  {
    question: "Explain Closures in JavaScript.",
    answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.",
    category: "JavaScript",
    difficulty: "Intermediate"
  },
  {
    question: "What is Prototypal Inheritance?",
    answer: "JavaScript is a prototype-based, object-oriented programming language. After an ES6 update, JavaScript allowed for prototypical inheritance, meaning that objects and methods can be shared, extended, and copied. Every object has a private property which holds a link to another object called its prototype.",
    category: "JavaScript",
    difficulty: "Advanced"
  },
  {
    question: "Explain Event Delegation.",
    answer: "Event delegation is a pattern based on event bubbling. It allows you to avoid adding event listeners to specific nodes; instead, the event listener is added to one parent. That event listener analyzes bubbled events to find a match on child elements.",
    category: "JavaScript",
    difficulty: "Intermediate"
  },
  {
    question: "What is the difference between a Component and a Directive in Angular?",
    answer: "In Angular, a Directive adds behavior to an existing DOM element. A Component is a specialized Directive that also has a template (HTML). Essentially, a Component is a directive with a view.",
    category: "Angular",
    difficulty: "Beginner"
  },
  {
    question: "Explain Ahead-of-Time (AOT) Compilation.",
    answer: "AOT compilation converts your Angular HTML and TypeScript code into efficient JavaScript code during the build phase, before the browser downloads and runs that code. This leads to faster rendering and smaller download sizes.",
    category: "Angular",
    difficulty: "Intermediate"
  },
  {
    question: "How do you handle state in a large Angular application?",
    answer: "State management in large Angular apps is often handled using libraries like NgRx (Redux pattern) or NGXS. Alternatively, shared services with RxJS Subjects or Signals can manage global state effectively for medium-sized apps.",
    category: "Angular",
    difficulty: "Advanced"
  },
  {
    question: "What are Angular Signals?",
    answer: "Introduced in Angular 16, Signals are a reactive primitive that tracks how your state is used throughout an application. They allow the framework to optimize change detection by precisely knowing which parts of the UI need to be updated.",
    category: "Angular",
    difficulty: "Intermediate"
  }
];

db.serialize(() => {
  seedData.forEach(q => {
    db.run(
      `INSERT INTO questions (question, answer, category, difficulty) VALUES (?, ?, ?, ?)`,
      [q.question, q.answer, q.category, q.difficulty],
      function(err) {
        if (!err) {
            db.run(`INSERT INTO interactions (question_id) VALUES (?)`, [this.lastID]);
        }
      }
    );
  });
  console.log("Seeding complete!");
});
