# CloudCollab Architecture Diagram

## User Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│ CloudCollab Workspace                   [user@email.com]│
├──────────────┬──────────────────────────────────────────┤
│  FILES       │  [New Folder] [New File] [Save] [Logout] │
│  user@..     ├──────────────────────────────────────────┤
│              │  📄 test.js                              │
│  📄 test.js  │                                          │
│  📄 style.css│  ┌────────────────────────────────────┐ │
│  📁 my-proj  │  │ console.log("Hello World");        │ │
│              │  │ document.title = "CloudCollab";    │ │
│              │  │                                    │ │
│              │  │ function myCode() {                │ │
│              │  │   return "Code is saved!";         │ │
│              │  │ }                                  │ │
│              │  └────────────────────────────────────┘ │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

## Data Flow

### Creating a File

```
User clicks "New File"
        ↓
Modal appears, user enters name
        ↓
User clicks "Create"
        ↓
Frontend: POST /file?name=test.js&email=user@example.com
        ↓
Backend creates: workspace/user@example.com/test.js
        ↓
Success message shown
        ↓
loadItems() called
        ↓
File appears in sidebar
```

### Opening a File

```
User clicks file in sidebar
        ↓
Frontend: GET /file/test.js?email=user@example.com
        ↓
Backend reads: workspace/user@example.com/test.js
        ↓
Returns: { "content": "console.log(...)" }
        ↓
Editor textarea populated with content
        ↓
User sees code and can edit
```

### Saving a File

```
User edits code in textarea
        ↓
User clicks "Save" button
        ↓
Frontend: PUT /file/test.js?email=user@example.com
          Body: { "content": "new code here" }
        ↓
Backend updates: workspace/user@example.com/test.js
        ↓
Returns: { "ok": true }
        ↓
"File saved successfully!" message
        ↓
Code persists permanently
```

## Storage Structure

```
backend/
│
├── main.py                    # FastAPI server
├── users_db.json              # { "email@example.com": { "password": "..." } }
│
└── workspace/
    ├── user1@gmail.com/
    │   ├── hello.js           # User 1's file
    │   ├── styles.css         # User 1's file
    │   └── index.html         # User 1's file
    │
    └── user2@gmail.com/
        ├── script.py          # User 2's file
        ├── notes.txt          # User 2's file
        └── config.json        # User 2's file
```

## Authentication Flow

```
┌─────────────────┐
│  login.html     │
└────────┬────────┘
         │
    User enters
    email & password
         │
         ↓
┌─────────────────────┐
│  auth-handler.js    │
│  POST /login        │
└────────┬────────────┘
         │
         ↓
┌─────────────────────────────┐
│  backend main.py            │
│  Check users_db.json        │
│  Validate credentials       │
└────────┬────────────────────┘
         │
    ✅ Valid
         │
         ↓
┌──────────────────────────┐
│ Redirect to workspace    │
│ Pass email in URL        │
│ Store in localStorage    │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────┐
│  workspace.html      │
│  workspace.js        │
│  Load user's files   │
└──────────────────────┘
```

## API Endpoints

```
┌─────────────────────────────────────────────────────────┐
│                    BACKEND ENDPOINTS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ AUTHENTICATION                                          │
│   POST /signup                                          │
│   POST /login                                           │
│                                                         │
│ FILES & FOLDERS                                         │
│   GET  /items?email=...          (list user's files)   │
│   POST /file?name=...&email=...  (create file)         │
│   POST /folder?name=...&email=.. (create folder)       │
│                                                         │
│ CODE EDITING                                            │
│   GET  /file/{filename}?email=.. (read file content)   │
│   PUT  /file/{filename}?email=.. (save file content)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Frontend Files

```
┌──────────────────────────────────────┐
│         FRONTEND FILES               │
├──────────────────────────────────────┤
│                                      │
│ index1.html          (Home page)     │
│ ↓                                    │
│ login.html           (Login/Signup)  │
│ ├── login-tabs.js    (Tab switcher)  │
│ └── auth-handler.js  (Auth logic)    │
│                                      │
│ workspace.html       (Main app)      │
│ ├── workspace.js     (Editor logic)  │
│ └── workspace.css    (Styling)       │
│                                      │
│ style1.css           (Global styles) │
│ login.css            (Login styles)  │
│                                      │
└──────────────────────────────────────┘
```

## User Session Flow

```
1. NEW USER
   │
   ├─→ Go to login.html
   ├─→ Click "Sign Up" tab
   ├─→ Enter name, email, password
   ├─→ POST /signup with credentials
   ├─→ Backend creates user folder
   ├─→ Redirect to workspace
   ├─→ Save email to localStorage
   └─→ loadItems() shows empty workspace

2. RETURNING USER
   │
   ├─→ Go to login.html
   ├─→ Click "Sign In" tab
   ├─→ Enter email, password
   ├─→ POST /login - validate
   ├─→ Redirect to workspace
   ├─→ Email in localStorage + URL
   ├─→ loadItems() shows their files
   └─→ Can click files to edit

3. SESSION MANAGEMENT
   │
   ├─→ userEmail stored in localStorage
   ├─→ userEmail also in URL ?email=...
   ├─→ All API calls include email
   ├─→ Each user isolated by email folder
   └─→ Logout clears localStorage
```

## Error Handling

```
SCENARIO: User not logged in
   ├─→ getEmail() returns null
   ├─→ Redirect to login.html
   └─→ Force re-authentication

SCENARIO: File not found
   ├─→ GET /file/missing.js
   ├─→ Returns { "content": "" }
   └─→ Editor shows empty

SCENARIO: Failed to save
   ├─→ PUT /file/... fails
   ├─→ response.ok = false
   ├─→ Show alert "Failed to save file"
   └─→ Code remains in editor

SCENARIO: Network error
   ├─→ fetch() throws exception
   ├─→ catch block handles
   ├─→ Show alert with error message
   └─→ User can retry
```

## Current Request/Response Examples

### Sign Up

```javascript
// Request
POST /signup
{
  "email": "user@example.com",
  "password": "mypassword123"
}

// Response
{
  "ok": true,
  "message": "User created successfully",
  "email": "user@example.com"
}
```

### Create File

```javascript
// Request
POST /file?name=hello.js&email=user@example.com

// Response
{
  "ok": true,
  "message": "File created successfully"
}
```

### Get File Content

```javascript
// Request
GET /file/hello.js?email=user@example.com

// Response
{
  "content": "console.log('Hello World');"
}
```

### Save File

```javascript
// Request
PUT /file/hello.js?email=user@example.com
{
  "content": "console.log('Updated!');"
}

// Response
{
  "ok": true
}
```

## Security Features

```
PATH VALIDATION
  User enters: "../../etc/passwd"
  Backend uses safe_path() function
  Validates path stays within user's folder
  Prevents access to other users' files

EMAIL NORMALIZATION
  User enters: "Test@EXAMPLE.COM"
  Converted to: "test@example.com"
  Consistent storage and access

PASSWORD VALIDATION
  Stored securely in users_db.json
  Compared against login attempt
  No passwords sent to frontend

USER ISOLATION
  Files in: workspace/email/
  API requires email parameter
  Cannot access other users' workspace
```

---

**This architecture ensures:**
✅ User data is isolated  
✅ Files persist permanently  
✅ Changes are saved immediately  
✅ Users can access their code anytime  
✅ System is scalable for more users
