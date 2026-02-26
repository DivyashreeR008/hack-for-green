# Quick Start Guide - CloudCollab Workspace

## Setup (First Time)

### 1. Start the Backend Server

Open terminal in `backend` folder:

```bash
python -m uvicorn main:app --reload --port 8001
```

You should see: `Uvicorn running on http://127.0.0.1:8001`

### 2. Open in Browser

Go to: `http://localhost:5500/login.html`
(or your local server URL)

## First Time User

### Step 1: Create Account

1. Click **"Sign Up"** tab
2. Enter any name, email, and password
3. Click **"Create Account"**
4. ✅ Account created, redirected to workspace

### Step 2: Create Your First File

1. Click **"New File"** button
2. Type filename: `hello.js`
3. Click **"Create"**
4. ✅ File appears in left sidebar

### Step 3: Edit the File

1. **Click** `hello.js` in sidebar
2. Textarea shows "Select a file to edit..."
3. You should see file content in editor (empty for new file)
4. Type your code:
   ```javascript
   console.log("Hello CloudCollab!");
   ```
5. Click **"Save"** button
6. ✅ Success message appears, code is saved!

### Step 4: Create Another File

1. Click **"New File"**
2. Type: `styles.css`
3. Click **"Create"**
4. Click `styles.css` in sidebar
5. Type CSS code:
   ```css
   body {
     background: #333;
     color: white;
   }
   ```
6. Click **"Save"**
7. ✅ Saved!

### Step 5: Logout & Login

1. Click **"Logout"** button
2. You're back at login screen
3. Click **"Sign In"** tab
4. Enter your email and password
5. Click **"Sign In"**
6. ✅ You see `hello.js` and `styles.css` still in sidebar!
7. Click each file to verify code is still there

## Returning User

1. Go to login page
2. Click **"Sign In"**
3. Enter email and password
4. Click all your files to edit them
5. Save changes with **"Save"** button
6. Click **"Logout"** when done

## Tips & Tricks

### Keyboard Shortcuts (Coming Soon)

- `Ctrl+S` to save
- `Ctrl+N` for new file
- `Ctrl+/` to comment code

### Creating Folders

- Click **"New Folder"**
- Enter folder name
- Works like files but for organization

### File Types You Can Create

- `script.js` - JavaScript
- `style.css` - CSS
- `index.html` - HTML
- `notes.txt` - Text files
- `config.json` - JSON
- Any filename works!

### What's Stored

- All your files
- All your code
- Associated with your email
- Safe and private

## Troubleshooting

### "Failed to fetch" Error

- ✅ Backend not running? Start with `uvicorn`
- ✅ Wrong port? Check it's running on 8001

### Can't save file

- ✅ Click **"Save"** button (not just edit)
- ✅ Check browser console for errors (F12)

### File list empty

- ✅ You haven't created files yet
- ✅ Click "New File" to create one

### Can't login

- ✅ Check email is spelled correctly
- ✅ Check password is correct
- ✅ Try signing up with new email

## File Structure After Use

```
workspace/
└── your-email@example.com/
    ├── hello.js
    ├── styles.css
    └── notes.txt
```

Each user has their own folder with their email as folder name!

## What Happens When You Save

1. You type code in the textarea
2. You click "Save"
3. Code sent to backend
4. Saved in `workspace/<your-email>/filename`
5. On next login, code is still there
6. Perfect for coding projects!

## Need More Features?

Future additions:

- [ ] Syntax highlighting
- [ ] Auto-save
- [ ] Multiple languages
- [ ] Folder file uploads
- [ ] File sharing
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme

---

**You're all set! Start creating files and coding! 🚀**
