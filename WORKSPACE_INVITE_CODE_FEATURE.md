# Workspace Invite Code Feature

## Overview

This feature allows users to share their workspace with others using a unique, persistent code. Each workspace has one permanent code that remains the same every time the workspace owner logs in.

## How It Works

### For Workspace Owners

1. When a user logs into their workspace, a unique code is automatically generated and displayed at the top of the right panel
2. The code is displayed in a prominent purple gradient box with the label "WORKSPACE CODE"
3. Users can click the "COPY" button to copy the code to their clipboard
4. The code is persistent - it will be the same every time the workspace owner logs in
5. Users can share this code with team members

### For Team Members Joining

1. Team members go to their workspace and click on the "🔗 Join Workspace" tab in the right panel
2. They enter the workspace code (8-character hex string in uppercase)
3. Upon successful validation, they are redirected to the workspace owner's workspace
4. They can now collaborate in the shared workspace

## Features

✅ **Unique Code Generation**: Each workspace gets a unique 8-character hexadecimal code
✅ **Persistent Code**: The same code is generated for every login (no regeneration)
✅ **Code Display**: Prominent display in the workspace interface
✅ **Copy to Clipboard**: Easy sharing via copy button
✅ **Join Functionality**: Team members can enter code to access workspace
✅ **Automatic Redirect**: After joining, users are redirected to the workspace owner's workspace
✅ **Validation**: Invalid or expired codes are rejected with appropriate error messages

## Example Usage

### Scenario: Harish sharing workspace with Greesh

1. **Harish logs in** to workspace `harishsm02@gmail.com`
   - System generates code: `939120AB`
   - Code is displayed prominently at the top of right panel
   - Code is saved in `workspace_codes.json`

2. **Harish shares the code** with Greesh (e.g., via email, chat, etc.)

3. **Greesh logs in** to her workspace `greesh@gmail.com`
   - Greesh opens the "🔗 Join Workspace" tab
   - Greesh enters code: `939120AB`
   - Greesh clicks "JOIN WORKSPACE"

4. **Greesh is redirected** to Harish's workspace
   - She can now access and edit files in Harish's workspace
   - She's also added as a team member in the team database

5. **Harish logs in again later**
   - The same code `939120AB` is displayed (persistent)
   - Other team members can continue using the same code to join

## Technical Implementation

### Backend Changes

- **New Database**: `workspace_codes.json` stores email-to-code mappings
- **New Endpoints**:
  - `GET /workspace/code?email={email}` - Get or create workspace code
  - `POST /workspace/join?code={code}&member_email={email}` - Join workspace with code

### Frontend Changes

- **UI Updates**:
  - Workspace code display section in right panel header
  - New "Join Workspace" tab in right panel
  - Code copy button with visual feedback
- **JavaScript Functions**:
  - `loadWorkspaceCode()` - Fetches and displays workspace code on page load
  - `joinWorkspaceBtn.onclick` - Handles joining workspace with code

### File Structure

```
workspace_codes.json (new)
└── {email}: {code}
    ├── "harishsm02@gmail.com": "939120AB"
    └── "greesh@gmail.com": "A1B2C3D4"
```

## Code Characteristics

- **Format**: 8-character hexadecimal string (0-9, A-F)
- **Case**: Automatically converted to uppercase
- **Uniqueness**: Extremely unlikely to collide (2^32 possible combinations)
- **Persistence**: Once created, the code never changes
- **Regeneration**: Not available - code is permanent

## Error Handling

| Scenario              | Error Message                                     |
| --------------------- | ------------------------------------------------- |
| Invalid code length   | "Please enter a valid 8-character workspace code" |
| Non-existent code     | "Invalid workspace code"                          |
| User not signed up    | "Member user not found. Please sign up first."    |
| Joining own workspace | "You are already the workspace owner"             |
| Server error          | Displays error message with details               |

## Files Modified

1. **backend/main.py**
   - Added `WORKSPACE_CODES_DB` constant
   - Added `load_workspace_codes()` function
   - Added `save_workspace_codes()` function
   - Added `get_or_create_workspace_code()` function
   - Added `@app.get("/workspace/code")` endpoint
   - Added `@app.post("/workspace/join")` endpoint

2. **workspace.html**
   - Added workspace code display section
   - Added "Join Workspace" tab
   - Added join workspace form with code input

3. **workspace.js**
   - Added `loadWorkspaceCode()` function
   - Added copy workspace code button handler
   - Added join workspace button handler

4. **workspace_codes.json** (new)
   - Stores persistent workspace codes

## Integration with Existing Features

- **Team System**: When a user joins via code, they are added to the workspace owner's team in `teams_db.json`
- **File Access**: Team members can access and edit files in the shared workspace
- **Chat & Collaboration**: Team members share the same chat and AI assistant context

## Security Considerations

- Codes are shared openly (not encrypted) - suitable for trusted team collaboration
- Any user with the code can join the workspace
- No expiration on codes - they remain valid indefinitely
- No limit on how many people can join with the same code

## Future Enhancements (Optional)

- Code expiration / regeneration options
- Rate limiting on join attempts
- Revoke specific codes
- View list of team members who joined via code
- Workspace code history/analytics
- QR code generation for easy sharing

## Testing the Feature

### Test Case 1: Generate and Persist Code

```
1. User harishsm02@gmail.com logs in
2. Code "939120AB" is displayed
3. User logs out and logs back in
4. Same code "939120AB" is displayed
✓ PASS - Code persists across logins
```

### Test Case 2: Join with Valid Code

```
1. Harish's code: "939120AB"
2. Greesh enters code in "Join Workspace" tab
3. Click "JOIN WORKSPACE"
4. Greesh redirected to harishsm02@gmail.com workspace
✓ PASS - User successfully joins and is redirected
```

### Test Case 3: Join with Invalid Code

```
1. Greesh enters code: "INVALID12"
2. Click "JOIN WORKSPACE"
3. Error message: "Invalid workspace code"
✓ PASS - Invalid codes are properly rejected
```

### Test Case 4: Copy Code

```
1. User clicks "COPY" button
2. Button text changes to "✓ COPIED" with color change
3. After 2 seconds, button returns to "COPY"
4. Code is available in clipboard
✓ PASS - Copy functionality works with feedback
```
