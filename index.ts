function greet(name: string) {
    console.log(`Hello, ${name}!`);
}

greet("World");

// Example of a DOM manipulation
const body = document.querySelector('body');
if (body) {
    body.innerHTML += "<p>This is added by TypeScript!</p>";
}