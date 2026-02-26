# Quick Test - Workspace Code Feature

## Backend Verification Checklist

Run these commands to verify the backend is working:

```bash
# Test 1: Get workspace code for Harish
curl "http://127.0.0.1:8001/workspace/code?email=harishsm02@gmail.com"
# Expected: {"ok": true, "email": "harishsm02@gmail.com", "code": "939120AB"}

# Test 2: Join workspace with valid code
curl -X POST "http://127.0.0.1:8001/workspace/join?code=939120AB&member_email=greesh@gmail.com"
# Expected: {"ok": true, "workspace_owner": "harishsm02@gmail.com", "member_email": "greesh@gmail.com", ...}

# Test 3: Join workspace with invalid code (should fail)
curl -X POST "http://127.0.0.1:8001/workspace/join?code=INVALID&member_email=greesh@gmail.com"
# Expected: {"detail": "Invalid workspace code"}
```

## Frontend Verification Checklist

1. **Workspace Code Display**:
   - [ ] Login to any account
   - [ ] Look at the top of the right panel
   - [ ] Should see a purple box labeled "WORKSPACE CODE"
   - [ ] Should see an 8-character code (e.g., 939120AB)
   - [ ] Should see a "COPY" button next to it

2. **Join Workspace Tab**:
   - [ ] In the right panel, look at the tab buttons
   - [ ] Should see 4 tabs: "💬 Team Chat", "🤖 AI Assistant", "📋 File Info", "🔗 Join Workspace"
   - [ ] Click on "🔗 Join Workspace" tab
   - [ ] Should see a text input field
   - [ ] Should see a "JOIN WORKSPACE" button

3. **Copy Code**:
   - [ ] Click the COPY button in the workspace code box
   - [ ] Button should turn green and show "✓ COPIED"
   - [ ] After 2 seconds, button should return to normal
   - [ ] Code should be copied to clipboard

4. **Join Workspace**:
   - [ ] Have Harish's code ready (e.g., 939120AB)
   - [ ] Login as Greesh
   - [ ] Go to "🔗 Join Workspace" tab
   - [ ] Paste Harish's code
   - [ ] Click "JOIN WORKSPACE"
   - [ ] Should see green success message: "✓ Success! Redirecting to harishsm02@gmail.com's workspace..."
   - [ ] After 2 seconds, page should reload showing Harish's workspace
   - [ ] File tree should show Harish's files

## If Tests Fail

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Hard refresh**: Ctrl+F5 (or Cmd+Shift+R on Mac)
3. **Check server is running**: Should see uvicorn output in terminal
4. **Check console for errors**: F12 → Console tab in browser

## Success Indicators

✅ You should be able to:

- See your workspace code in the purple box
- Copy the code to clipboard
- Share code with teammates
- Use "Join Workspace" tab to enter code
- Get redirected to shared workspace after joining

❌ You should NOT:

- Use the old "Invite Team" button for workspace codes
- See the invitation key modal when using Join Workspace
- See expired or changing codes
