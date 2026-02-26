# Quick Start: Version Control & Team Invitations

## For Team Leads 🎯

### Step 1: Generate Invitation Key

1. Click **"👥 Invite Team"** button in your workspace
2. Your unique 8-character key will appear (e.g., `A1B2C3D4`)
3. Click **"Copy Key"** to copy to clipboard

### Step 2: Share the Key

Send the key to team members via:

- Email
- Slack
- WhatsApp
- Any communication channel

### Step 3: Monitor Your Team

- Click "Invite Team" anytime to see:
  - All team members who've joined
  - Active invitation keys
  - Team information

### Step 4: Manage Keys

- Click **"Generate New Key"** if you want to:
  - Create a backup key
  - Change the key for security
  - Note: Existing members remain in the team

---

## For Team Members 👥

### Step 1: Get the Invitation Key

Ask your team lead for the 8-character invitation key.

### Step 2: Join the Team

1. Open the workspace application
2. Login with your email and password
3. Click **"👥 Invite Team"** button
4. Enter the invitation key in the text field
5. Click **"Join Team"**

### Step 3: You're In! 🎉

- You'll be redirected to your team lead's workspace
- You can now see all files and collaborate
- Click on files to open and edit them

---

## Version Control Features 📋

### View File History

1. Open any file
2. Switch to **"📋 File Info"** tab (right panel)
3. See:
   - When file was created
   - Who created it
   - When it was last modified
   - Who modified it
   - Complete version history

### Version History Shows:

- **Timestamp**: Exact date and time
- **File Size**: Size in bytes
- **Who Modified**: Email of the person who edited
- **Version Number**: Sequential (v1, v2, v3, etc.)

---

## FAQ - Quick Answers

| Question                              | Answer                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------ |
| What's the invitation key format?     | 8 characters, uppercase letters and numbers (e.g., `X9Y8Z7W6`)           |
| Can I share the key on social media?  | No, keep it private. Share only with trusted team members.               |
| What happens if I regenerate the key? | New key is created. Old members stay. Only new members need the new key. |
| Can I see who changed what?           | Yes, check File Info tab. All edits are tracked with email.              |
| Can I undo changes?                   | Not yet, but we're planning version restore soon.                        |
| How many team members can I have?     | Unlimited!                                                               |
| Can I be in multiple teams?           | Currently, you're either a team lead or member of one team.              |
| Is my data encrypted?                 | All data is stored locally. Use HTTPS in production.                     |

---

## Example Workflow

### Scenario: Launching a Website Project

**Team Lead (Sarah):**

1. Creates folders: `design/`, `code/`, `content/`
2. Creates files: `index.html`, `style.css`
3. Clicks "Invite Team" → Gets key: `S4R4H1234`
4. Sends key to John and Maria

**Team Member (John):**

1. Receives key: `S4R4H1234`
2. Clicks "Invite Team" → Enters key
3. Clicks "Join Team"
4. Redirected to Sarah's workspace
5. Opens `index.html` → Switch to File Info tab
6. Sees Sarah created it on Feb 1 at 10:30 AM
7. Edits file → Saves
8. His edit is now logged in version history

**Team Member (Maria):**

1. Does the same as John
2. Opens `style.css` → Edits → Saves
3. John sees file was modified by Maria

**Everyone:**

- Can see File Info for all files
- Know when files were created and by whom
- See complete modification history
- Work together seamlessly

---

## File Info Tab Details

When you click on **"📋 File Info"** and have a file open, you'll see:

```
📄 example.html

File: example.html
Created: Feb 1, 2026, 10:30 AM
Created by: sarah@example.com
Modified: Feb 1, 2026, 11:45 AM
Modified by: john@example.com

Version History (3):
├─ v3: Feb 1, 2026, 11:45 AM | 250 bytes | By: john@example.com
├─ v2: Feb 1, 2026, 11:00 AM | 200 bytes | By: sarah@example.com
└─ v1: Feb 1, 2026, 10:30 AM | 150 bytes | By: sarah@example.com
```

---

## Troubleshooting 🔧

### "Invalid or inactive invitation key"

- ✓ Check that you typed it correctly (case-sensitive)
- ✓ Confirm the key has 8 characters
- ✓ Ask team lead to regenerate if key is old

### "Member user not found"

- ✓ Make sure you have an account first
- ✓ Sign up with your email before joining a team

### Files not showing in File Info

- ✓ File info only tracks changes after version control was enabled
- ✓ Close and reopen the file
- ✓ Edit and save the file to create a version entry

### Team member still appears after regenerating key

- ✓ This is correct! Old members stay in the team
- ✓ Regenerating key only affects NEW members

---

## Security Tips 🔒

1. **Keep Keys Private**: Never share invitation keys publicly
2. **Regenerate If Compromised**: If key leaked, generate a new one
3. **Share Safely**: Use secure communication (not social media)
4. **Check Modifications**: Review File Info to see who changed what
5. **Audit Trail**: All changes are logged with email addresses

---

## Keyboard Shortcuts (if implemented in future)

| Shortcut | Action              |
| -------- | ------------------- |
| `Ctrl+S` | Save current file   |
| `Ctrl+K` | Show invitation key |
| `Ctrl+J` | Join team dialog    |

_Note: Keyboard shortcuts coming soon!_

---

## Need Help?

- Check **VERSION_CONTROL_GUIDE.md** for detailed documentation
- Check **IMPLEMENTATION_NOTES.md** for technical details
- All features are supported in modern browsers (Chrome, Firefox, Safari, Edge)
- Minimum screen size: 1024x768 recommended for comfortable use

---

## What's Next?

We're planning these features soon:

- ✓ Version restore (revert to previous versions)
- ✓ Diff viewer (see what changed between versions)
- ✓ Export history (download version history as CSV)
- ✓ Activity feed (real-time team activity)
- ✓ File comments (add notes to versions)
- ✓ Team management (remove/archive members)

---

Happy collaborating! 🚀
