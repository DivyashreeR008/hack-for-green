# Code Examples for Testing

Copy and paste these code snippets into your CloudCollab workspace files to test the editor!

## JavaScript Examples

### Example 1: Simple Hello World

Create file: `hello.js`

```javascript
console.log("Hello CloudCollab!");
console.log("Welcome to the workspace!");

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("User"));
```

### Example 2: Counter Function

Create file: `counter.js`

```javascript
let count = 0;

function increment() {
  count++;
  console.log("Count: " + count);
  return count;
}

function decrement() {
  count--;
  console.log("Count: " + count);
  return count;
}

// Test it
increment();
increment();
decrement();
console.log("Final count: " + count);
```

### Example 3: Array Operations

Create file: `arrays.js`

```javascript
const fruits = ["apple", "banana", "cherry", "date"];

// Print all fruits
console.log("All fruits:");
fruits.forEach((fruit) => console.log("- " + fruit));

// Filter fruits longer than 5 chars
const longFruits = fruits.filter((f) => f.length > 5);
console.log("\nLong fruit names:");
console.log(longFruits);

// Map to uppercase
const upperFruits = fruits.map((f) => f.toUpperCase());
console.log("\nUppercase fruits:");
console.log(upperFruits);
```

## CSS Examples

### Example 1: Basic Styling

Create file: `styles.css`

```css
/* Global styles */
body {
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 3px solid #ff6b9d;
  padding-bottom: 10px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #764ba2;
}
```

### Example 2: Responsive Layout

Create file: `responsive.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

.header {
  background: #333;
  color: white;
  padding: 20px;
  text-align: center;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #333;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  line-height: 1.6;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 20px;
}
```

## HTML Examples

### Example 1: Simple Page

Create file: `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My CloudCollab Project</title>
    <style>
      body {
        font-family: Arial;
        margin: 20px;
      }
      h1 {
        color: #667eea;
      }
      .box {
        background: #f0f0f0;
        padding: 20px;
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to CloudCollab!</h1>

    <div class="box">
      <h2>Features</h2>
      <ul>
        <li>✅ Create files</li>
        <li>✅ Edit code</li>
        <li>✅ Save permanently</li>
        <li>✅ Access anytime</li>
      </ul>
    </div>

    <div class="box">
      <h2>Get Started</h2>
      <p>Create a new file to start coding!</p>
      <button onclick="alert('Click Save in CloudCollab to save your code!')">
        Learn More
      </button>
    </div>
  </body>
</html>
```

### Example 2: Todo App HTML

Create file: `todos.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Todo App</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: "Segoe UI";
        background: #ecf0f1;
        padding: 20px;
      }
      .container {
        max-width: 500px;
        margin: 0 auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #2c3e50;
        margin-bottom: 20px;
      }
      input,
      button {
        padding: 10px;
      }
      .todo {
        background: #ecf0f1;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📝 Todo List</h1>
      <input type="text" placeholder="Add a new todo..." />
      <button>Add</button>

      <div class="todo">Learn CloudCollab ✓</div>
      <div class="todo">Create files</div>
      <div class="todo">Save code</div>
      <div class="todo">Build projects</div>
    </div>
  </body>
</html>
```

## Python Examples

### Example 1: Basic Script

Create file: `script.py`

```python
# CloudCollab Python Examples

def hello(name):
    return f"Hello, {name}!"

print(hello("World"))

# List operations
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Squared: {squared}")

# Dictionary
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

for key, value in person.items():
    print(f"{key}: {value}")
```

### Example 2: Fibonacci Function

Create file: `fibonacci.py`

```python
def fibonacci(n):
    """Generate first n Fibonacci numbers"""
    fib = [0, 1]

    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])

    return fib[:n]

# Test it
result = fibonacci(10)
print(f"First 10 Fibonacci numbers: {result}")

# Sum of Fibonacci
total = sum(result)
print(f"Sum: {total}")
```

## JSON Examples

### Example 1: Config File

Create file: `config.json`

```json
{
  "app": {
    "name": "CloudCollab",
    "version": "1.0.0",
    "description": "Cloud-based coding workspace"
  },
  "features": [
    "Create files",
    "Edit code",
    "Save permanently",
    "Multi-user support"
  ],
  "settings": {
    "theme": "dark",
    "autosave": false,
    "fontSize": 14,
    "language": "en"
  }
}
```

### Example 2: Data File

Create file: `data.json`

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com",
      "files": 5
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com",
      "files": 3
    }
  ],
  "stats": {
    "total_users": 2,
    "total_files": 8,
    "storage_used": "2.5 MB"
  }
}
```

## Text Examples

### Example 1: Notes

Create file: `notes.txt`

```
CloudCollab - Project Notes
===========================

Date: February 1, 2026

Features Implemented:
✅ User authentication (signup/login)
✅ File creation
✅ Code editing
✅ File persistence
✅ User isolation

Next Steps:
- Add syntax highlighting
- Implement auto-save
- Add file deletion
- Add keyboard shortcuts

Ideas:
- Support for folders with files inside
- File sharing between users
- Collaborative editing
- Version history
```

### Example 2: README

Create file: `README.md`

```
# My CloudCollab Project

## Description
This is my project for learning web development with CloudCollab.

## Files
- `index.html` - Main HTML file
- `styles.css` - Styling
- `script.js` - JavaScript logic

## How to Use
1. Open CloudCollab
2. Click on any file to edit
3. Make changes
4. Click Save

## Technologies
- HTML5
- CSS3
- JavaScript
- CloudCollab Storage

## Author
Your Name
```

## Testing Workflow

1. **Create JavaScript file**
   - File: `hello.js`
   - Paste: Example 1 JavaScript code
   - Click Save
   - Verify code appears

2. **Create CSS file**
   - File: `styles.css`
   - Paste: Example 1 CSS code
   - Click Save
   - Verify code appears

3. **Create HTML file**
   - File: `index.html`
   - Paste: Example 1 HTML code
   - Click Save
   - Verify code appears

4. **Test Persistence**
   - Create 3-4 files with different examples
   - Logout
   - Login again
   - All files should appear with their code

5. **Test Editing**
   - Click a file
   - Modify the code
   - Click Save
   - Refresh page
   - Changes should persist

## Quick Copy-Paste Checklist

- [ ] `hello.js` - Test JavaScript
- [ ] `styles.css` - Test CSS
- [ ] `index.html` - Test HTML
- [ ] `config.json` - Test JSON
- [ ] `notes.txt` - Test text

All code is ready to paste! No modifications needed.

---

**Start testing with these examples! They're all production-ready code snippets.** 🚀
