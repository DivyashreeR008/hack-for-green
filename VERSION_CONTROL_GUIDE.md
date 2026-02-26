# Version Control & Team Invitation Guide

## Overview

This document explains the new version control and team collaboration features in CloudCollab.

---

## Version Control Features

### File Creation Tracking

When you create a new file or folder, the system automatically records:

- **Created timestamp**: Exact date and time the file was created
- **Created by**: Email of the user who created it
- **File path**: Location in the workspace
- **File type**: Whether it's a file or folder

### File Modification Tracking

Every time you save a file, the system logs:

- **Modified timestamp**: Exact date and time of modification
- **Modified by**: Email of the user who modified it
- **File size**: Size in bytes at that version
- **Version number**: Sequential version number (v1, v2, v3, etc.)

### Viewing File History

1. Open any file in the workspace
2. Switch to the **"📋 File Info"** tab in the right panel
3. View:
   - File creation date and creator
   - Last modification date and who modified it
   - Complete version history (shows last 5 versions)
   - File size for each version

### Version History Storage

All version information is stored in `file_versions_db.json` with the following structure:

```json
{
  "email/path/to/file.txt": {
    "type": "file",
    "created": "2026-02-01T10:30:00.000000",
    "created_by": "user@example.com",
    "modified": "2026-02-01T11:45:00.000000",
    "modified_by": "user@example.com",
    "versions": [
      {
        "timestamp": "2026-02-01T10:30:00.000000",
        "size": 150,
        "modified_by": "user@example.com"
      },
      {
        "timestamp": "2026-02-01T11:45:00.000000",
        "size": 250,
        "modified_by": "user@example.com"
      }
    ]
  }
}
```

---

## Team Invitation System

### Unique Invitation Keys

Instead of share links, CloudCollab uses **unique 8-character alphanumeric keys** for secure team invitations.

**Key Format**: `A1B2C3D4` (8 characters, uppercase letters and numbers)

### For Team Leads

#### Generating an Invitation Key

1. Click the **"👥 Invite Team"** button in the right panel
2. You'll see your unique invitation key
3. Share this key with team members via email, Slack, or any communication channel

#### Regenerating Keys

- Click **"Generate New Key"** to create a new invitation key
- Old keys become inactive but team members who already joined remain in your team
- Use this if you think a key has been compromised

#### Copying the Key

- Click **"Copy Key"** to copy the key to your clipboard
- Share it safely with your team members

### For Team Members

#### Joining a Team

1. Click the **"👥 Invite Team"** button
2. Enter the 8-character invitation key provided by your team lead
3. Click **"Join Team"**
4. You'll be automatically redirected to the team lead's workspace
5. Your account will be added to the team members list

#### What Happens When You Join?

- Your account is linked to the team lead's workspace
- You gain access to all files and folders in that workspace
- You can edit, create, and delete files together
- Your actions are tracked with your email address
- You remain a member until removed by the team lead

### Team Information

Access team info anytime by clicking **"👥 Invite Team"** to see:

- Whether you're a team lead or member
- Who the team lead is
- List of all team members
- Active invitation keys (team leads only)

---

## API Endpoints for Version Control & Teams

### Team Endpoints

#### Generate Invitation Key

```
POST /team/generate-invite-key?email=user@example.com
Response: {
  "ok": true,
  "invitation_key": "A1B2C3D4",
  "team_lead": "user@example.com"
}
```

#### Join Team

```
POST /team/join-team
Body: {
  "invitation_key": "A1B2C3D4",
  "member_email": "member@example.com"
}
Response: {
  "ok": true,
  "team_lead": "lead@example.com",
  "member_email": "member@example.com"
}
```

#### Get Team Info

```
GET /team/info?email=user@example.com
Response: {
  "ok": true,
  "is_team_lead": true,
  "team_lead": "user@example.com",
  "members": ["member1@example.com", "member2@example.com"],
  "invitation_keys": [{"key": "A1B2C3D4", "created": "...", "active": true}]
}
```

### Version Control Endpoints

#### Get File Version History

```
GET /file/versions/{path}?email=user@example.com
Response: {
  "ok": true,
  "file": "email/path/to/file.txt",
  "versions": {
    "type": "file",
    "created": "2026-02-01T10:30:00",
    "created_by": "user@example.com",
    "modified": "2026-02-01T11:45:00",
    "modified_by": "user@example.com",
    "versions": [...]
  }
}
```

---

## Database Files

### teams_db.json

Stores team information and invitation keys:

```json
{
  "team_lead@example.com": {
    "team_lead": "team_lead@example.com",
    "members": ["member1@example.com"],
    "invitation_keys": [
      {
        "key": "A1B2C3D4",
        "created": "2026-02-01T10:30:00",
        "active": true
      }
    ]
  }
}
```

### file_versions_db.json

Stores all file version metadata with creation and modification history.

---

## Security Notes

1. **Invitation Keys**: Share keys only with trusted team members
2. **Key Regeneration**: Regenerate keys if you suspect they've been shared publicly
3. **Team Members**: Only active users can join using valid keys
4. **Audit Trail**: All modifications are tracked with email addresses for accountability

---

## Workflow Example

### Scenario: Starting a New Team Project

1. **Team Lead Creates Files**
   - Sign up or login as team lead
   - Create project folders and files
   - System automatically tracks: who created, when, and versions

2. **Team Lead Invites Members**
   - Click "Invite Team" button
   - Get unique key: `X9Y8Z7W6`
   - Share via email to team members

3. **Team Members Join**
   - Click "Invite Team" button
   - Enter key: `X9Y8Z7W6`
   - Redirected to team lead's workspace
   - Can now see all files and collaborate

4. **Working Together**
   - Each member's edits are tracked with their email
   - File history shows who changed what and when
   - View history in "File Info" tab

---

## FAQ

**Q: Can team members see who modified each file?**
A: Yes, check the "File Info" tab to see modification history with email addresses.

**Q: What if I want to remove a team member?**
A: Currently, all members have full access. Keys can be regenerated to prevent new members from joining.

**Q: Can I have multiple teams?**
A: Currently, each user is either a team lead of one team or a member of one team.

**Q: How far back does version history go?**
A: All versions are kept indefinitely until the file is deleted.

**Q: Is the data secure?**
A: Version data is stored locally. Use HTTPS in production and secure your invitation keys.

---

## Troubleshooting

**Issue**: Invitation key says "invalid or inactive"

- **Solution**: Make sure you entered the exact 8-character key correctly (case-sensitive)

**Issue**: Can't see file modifications in version history

- **Solution**: File info only shows changes after version control was enabled. New saves will be tracked.

**Issue**: Team member not showing in member list

- **Solution**: Make sure they used the correct invitation key and that it was active at the time of joining.
