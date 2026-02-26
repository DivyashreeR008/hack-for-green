const API = "http://127.0.0.1:8001";

const tree = document.getElementById("fileTree");
const modal = document.getElementById("modal");
const title = document.getElementById("modalTitle");
const input = document.getElementById("itemName");
const userEmailDisplay = document.getElementById("userEmail");
const modalMessage = document.getElementById("modalMessage");
const codeEditor = document.getElementById("codeEditor");
const currentFileName = document.getElementById("currentFileName");

// Meeting scheduler elements
const scheduleBtn = document.getElementById("scheduleMeetBtn");
const meetingModal = document.getElementById("meetingModal");
const meetingDateTimeInput = document.getElementById("meetingDateTime");
const cancelMeetingBtn = document.getElementById("cancelMeetingBtn");
const createMeetingBtn = document.getElementById("createMeetingBtn");
const meetingMessage = document.getElementById("meetingMessage");

let currentType = "";
let userEmail = "";
let currentFile = null;
let ws = null;
let viewerEmail = null; // identity used for chat (may differ from workspace owner)
let fileOwner = null; // which workspace's files/folders/code are being viewed
let onlineUsers = {}; // Track online status of users - Map<email, boolean>

// Get email from URL or localStorage
function getEmail() {
  const params = new URLSearchParams(window.location.search);
  let email = params.get('email');
  
  if (!email) {
    email = localStorage.getItem('userEmail');
  }
  
  if (!email) {
    // Redirect to login if no email found
    window.location.href = 'login.html';
    return null;
  }
  
  return email;
}

// Load file content into editor
async function openFile(fileName) {
  try {
    const res = await fetch(`${API}/file/${encodeURIComponent(fileName)}?email=${encodeURIComponent(fileOwner || userEmail)}&viewer=${encodeURIComponent(viewerEmail || userEmail)}`);
    const data = await res.json();
    
    codeEditor.value = data.content || "";
    currentFile = fileName;
    currentFileName.textContent = `📄 ${fileName}`;
    codeEditor.focus();
    
    // Load file version info
    await loadFileInfo(fileName);
  } catch (error) {
    console.error("Error opening file:", error);
    codeEditor.value = "// Error loading file";
  }
}

// Load and display file information
async function loadFileInfo(fileName) {
  try {
    const email = fileOwner || userEmail;
    console.log('Loading file info for:', { fileName, email, fileOwner, userEmail });
    
    const res = await fetch(`${API}/file/versions/${encodeURIComponent(fileName)}?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    console.log('File versions response:', data);
    
    let infoHTML = '';
    
    if (data.versions) {
      const v = data.versions;
      infoHTML = `
        <div style="padding: 12px; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
          <p style="margin: 8px 0; font-weight: 600; color: #60a5fa;">📄 ${fileName}</p>
      `;
      
      if (v.created) {
        infoHTML += `<p style="margin: 6px 0; color: #cbd5e1;"><span style="color: #9ca3af;">Created:</span> ${new Date(v.created).toLocaleString()}</p>`;
      }
      if (v.created_by) {
        infoHTML += `<p style="margin: 6px 0; color: #cbd5e1;"><span style="color: #9ca3af;">Created by:</span> <strong>${v.created_by}</strong></p>`;
      }
      if (v.modified) {
        infoHTML += `<p style="margin: 6px 0; color: #cbd5e1;"><span style="color: #9ca3af;">Last Modified:</span> ${new Date(v.modified).toLocaleString()}</p>`;
      }
      if (v.modified_by) {
        infoHTML += `<p style="margin: 6px 0; color: #cbd5e1;"><span style="color: #9ca3af;">Last Modified by:</span> <strong>${v.modified_by}</strong></p>`;
      }
      
      infoHTML += `</div>`;
      
      // Show version history with all versions visible to team
      if (v.versions && v.versions.length > 0) {
        infoHTML += `
          <div style="margin-top: 15px; padding: 12px; background: #0f172a; border-radius: 8px; border: 1px solid #334155;">
            <div style="font-weight: 600; color: #60a5fa; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>⏱️ Version History (${v.versions.length} ${v.versions.length === 1 ? 'version' : 'versions'})</span>
            </div>
        `;
        
        // Show all versions in reverse order (newest first)
        v.versions.slice().reverse().forEach((version, idx) => {
          const vNum = v.versions.length - idx;
          const actualIdx = v.versions.length - 1 - idx;  // Index in original array
          const ts = new Date(version.timestamp);
          const timeAgo = getTimeAgo(ts);
          const isRestored = version.restored_from !== undefined;
          
          infoHTML += `
            <div style="padding: 10px; background: #1e293b; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #10b981; cursor: pointer; transition: all 0.2s;" class="version-item" data-version-idx="${actualIdx}" data-file-name="${fileName}" onmouseover="this.style.borderLeftColor='#60a5fa'; this.style.boxShadow='0 0 8px rgba(96,165,250,0.3)'" onmouseout="this.style.borderLeftColor='#10b981'; this.style.boxShadow='none'">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 600; color: #60a5fa;">v${vNum} ${isRestored ? '↩️ Restored' : ''}</span>
                <span style="font-size: 11px; color: #9ca3af;">${ts.toLocaleString()}</span>
              </div>
              <div style="display: flex; gap: 16px; font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">
                <div>📦 Size: <strong>${version.size}</strong> bytes</div>
                ${version.modified_by ? `<div>👤 Editor: <strong>${version.modified_by}</strong></div>` : ''}
                <div style="color: #6b7280;">${timeAgo}</div>
              </div>
              <button class="restore-btn" style="width: 100%; padding: 6px; background: #3b82f6; border: none; border-radius: 4px; color: white; font-size: 11px; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'" onclick="event.stopPropagation(); restoreFileVersion('${fileName}', ${actualIdx})">
                ↶ Checkout this version
              </button>
            </div>
          `;
        });
        
        infoHTML += `</div>`;
      } else {
        infoHTML += `<p style="color: #6b7280; text-align: center; padding: 20px; margin-top: 10px;">No version history available yet</p>`;
      }
    } else {
      // No versions data
      infoHTML = `<p style="color: #6b7280; text-align: center; padding: 20px;">📄 ${fileName}<br><br>File info not available. Start editing to track versions.</p>`;
    }
    
    document.getElementById("fileInfoContent").innerHTML = infoHTML;
  } catch (error) {
    console.error("Error loading file info:", error);
    document.getElementById("fileInfoContent").innerHTML = `<p style="color: #ef4444;">❌ Error loading file info: ${error.message}</p>`;
  }
}

// Helper function to format time ago

// show meeting/toast notification
function showMeetingNotification(time, link, copied=false) {
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;bottom:90px;right:20px;background:#3b82f6;color:#fff;padding:12px 16px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.3);z-index:10000;`;
  const when = time ? new Date(time).toLocaleString() : '';
  toast.innerHTML = `📅 Meeting at ${when} <a href="${link}" target="_blank" style="color:#ffeb3b; text-decoration:underline; margin-left:8px;">Join</a>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 10000);
  if (copied) {
    const note = document.createElement('div');
    note.style.cssText = 'position:fixed;bottom:160px;right:20px;background:#10b981;color:#fff;padding:8px 12px;border-radius:6px;z-index:10000;';
    note.textContent = 'Link copied to clipboard';
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
  }
}

// event handlers for meeting scheduler
scheduleBtn.onclick = () => {
  meetingModal.classList.remove('hidden');
};

cancelMeetingBtn.onclick = () => {
  meetingModal.classList.add('hidden');
  meetingMessage.style.display = 'none';
};

createMeetingBtn.onclick = async () => {
  const dt = meetingDateTimeInput.value;
  const linkInput = document.getElementById('meetingLink').value.trim();
  if (!dt) {
    meetingMessage.textContent = 'Please select date and time';
    meetingMessage.style.display = 'block';
    return;
  }
  try {
    const payload = {
      workspace: fileOwner || userEmail,
      time: dt,
      link: linkInput || undefined
    };
    const res = await fetch(`${API}/meeting/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      meetingModal.classList.add('hidden');
      meetingMessage.style.display = 'none';
      // copy link
      if (data.link) {
        try { await navigator.clipboard.writeText(data.link); } catch (e) {}
        showMeetingNotification(dt, data.link, true);
      }
    } else {
      meetingMessage.textContent = data.detail || 'Failed to schedule meeting';
      meetingMessage.style.display = 'block';
    }
  } catch (err) {
    meetingMessage.textContent = err.message;
    meetingMessage.style.display = 'block';
  }
};

// Run Python file
async function runPythonFile(filePath) {
  try {
    const email = fileOwner || userEmail;
    console.log('Running Python file:', filePath);
    
    // Show terminal panel
    const terminalPanel = document.getElementById('terminalPanel');
    const terminalOutput = document.getElementById('terminalOutput');
    terminalPanel.style.display = 'block';
    
    // Show running message
    terminalOutput.textContent = `▶ Running: ${filePath}\n\n`;
    
    // Call backend to execute Python file
    const res = await fetch(`${API}/run/python?email=${encodeURIComponent(email)}&file=${encodeURIComponent(filePath)}`, {
      method: 'POST'
    });
    
    const result = await res.json();
    
    if (result.status === 'running') {
      terminalOutput.textContent += `✅ Execution completed (code: ${result.return_code})\n\n`;
      if (result.output) {
        terminalOutput.textContent += result.output;
      }
      
      // Auto scroll to bottom
      terminalPanel.scrollTop = terminalPanel.scrollHeight;
    } else {
      terminalOutput.textContent += `❌ Error: ${result.error || 'Unknown error'}`;
    }
  } catch (error) {
    console.error('Error running Python file:', error);
    const terminalOutput = document.getElementById('terminalOutput');
    terminalOutput.textContent += `\n❌ Failed to run file: ${error.message}`;
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Restore file to a previous version
async function restoreFileVersion(fileName, versionIdx) {
  if (!confirm(`Restore to version ${versionIdx + 1}? This will create a new version entry.`)) return;
  
  try {
    const response = await fetch(`${API}/file/restore/${encodeURIComponent(fileName)}?version_index=${versionIdx}&email=${encodeURIComponent(fileOwner || userEmail)}&actor=${encodeURIComponent(userEmail)}`, {
      method: 'POST'
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('File restored:', data);
      // Reload the file content from server
      const fileRes = await fetch(`${API}/file/${encodeURIComponent(fileName)}?email=${encodeURIComponent(fileOwner || userEmail)}`);
      const fileData = await fileRes.json();
      codeEditor.value = fileData.content || '';
      
      // Reload file info to show new version
      await loadFileInfo(fileName);
      
      // Show success notification
      const notif = document.createElement('div');
      notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;font-weight:600;z-index:10000;';
      notif.textContent = `✓ Restored to version ${versionIdx + 1}`;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 3000);
    } else {
      alert('Error restoring file: ' + (data.detail || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error restoring file:', error);
    alert('Error restoring file: ' + error.message);
  }
}

// Save file content
async function saveFile() {
  if (!currentFile) {
    alert("No file selected");
    return;
  }

  try {
    const response = await fetch(`${API}/file/${encodeURIComponent(currentFile)}?email=${encodeURIComponent(fileOwner || userEmail)}&actor=${encodeURIComponent(userEmail)}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: codeEditor.value })
    });

    if (response.ok) {
      console.log('File saved successfully, reloading file info...');
      // Reload file info to show new version
      await loadFileInfo(currentFile);
      alert("File saved successfully!");
    } else {
      alert("Failed to save file");
    }
  } catch (error) {
    console.error("Error saving file:", error);
    alert("Error saving file: " + error.message);
  }
}

// Load and display projects
async function loadProjects() {
  try {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;

    // Fetch projects from backend
    const res = await fetch(`${API}/projects?email=${encodeURIComponent(fileOwner || userEmail)}`);
    
    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status);
      projectsList.innerHTML = '';
      return;
    }
    
    const data = await res.json();
    
    if (!data || !data.projects) {
      projectsList.innerHTML = '';
      return;
    }
    
    const projects = data.projects || [];
    projectsList.innerHTML = '';

    if (projects.length === 0) {
      projectsList.innerHTML = '';
      return;
    }

    // Check for deadline reached and show notifications
    projects.forEach(project => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(project.deadline);
      deadline.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      
      // Show notification if deadline is reached or passed
      if (daysLeft === 0) {
        showDeadlineNotification(project.name, 'TODAY');
      } else if (daysLeft < 0) {
        showDeadlineNotification(project.name, 'EXPIRED');
      }
    });

    projects.forEach(project => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(project.deadline);
      deadline.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      
      // Red if 3 days or less, otherwise green
      const isUrgent = daysLeft <= 3 && daysLeft >= 0;
      const isExpired = daysLeft < 0;
      const statusClass = isExpired ? 'expired' : (isUrgent ? 'urgent' : 'normal');
      
      const projectEl = document.createElement('div');
      projectEl.className = 'project-item';
      projectEl.innerHTML = `
        <div class="project-item-header">
          <div class="project-name">${project.name}</div>
          <div class="project-actions">
            <button class="small-btn project-add-btn" data-project-name="${project.name}" title="Add file">+</button>
            <button class="small-btn project-delete-btn" data-project-id="${project.id}" title="Delete">✕</button>
          </div>
        </div>
        <div class="project-status ${isExpired ? 'expired' : ''}">${isExpired ? 'Expired' : 'Active'}</div>
        <div class="project-deadline">Deadline: ${deadline.toLocaleDateString()}</div>
        <div class="project-days-left ${statusClass}">
          📅 ${isExpired ? 'Expired' : daysLeft + ' days left'}
        </div>
      `;
      
      // Add click handlers
      const addBtn = projectEl.querySelector('.project-add-btn');
      if (addBtn) {
        addBtn.onclick = (e) => {
          e.stopPropagation();
          createTargetPath = project.name;
          openModal("file");
        };
      }
      
      const deleteBtn = projectEl.querySelector('.project-delete-btn');
      if (deleteBtn) {
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Delete project "${project.name}"?`)) {
            deleteProject(project.id);
          }
        };
      }
      
      projectsList.appendChild(projectEl);
    });

  } catch (error) {
    console.error("Error loading projects:", error);
    const projectsList = document.getElementById('projectsList');
    if (projectsList) {
      projectsList.innerHTML = '';
    }
  }
}

// Show deadline notification
function showDeadlineNotification(projectName, status) {
  // Show toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${status === 'EXPIRED' ? '#ef4444' : '#f59e0b'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: bold;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  const icon = status === 'EXPIRED' ? '⏰' : '⚠️';
  const message = status === 'EXPIRED' ? 
    `Deadline Expired: "${projectName}"` : 
    `Deadline TODAY: "${projectName}"`;
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 20px;">${icon}</span>
      <div>
        <div style="font-weight: 700; margin-bottom: 4px;">${status}</div>
        <div>${message}</div>
      </div>
      <button style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 10px;" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove after 8 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 8000);
  
  // Request browser notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(status, {
      body: `Project deadline: ${projectName}`,
      icon: status === 'EXPIRED' ? '⏰' : '⚠️',
      tag: `deadline-${projectName}`,
      requireInteraction: true
    });
  }
}

// Delete project function
async function deleteProject(projectId) {
  try {
    const res = await fetch(`${API}/project/${projectId}?email=${encodeURIComponent(fileOwner || userEmail)}&actor=${encodeURIComponent(viewerEmail || userEmail)}`, {
      method: 'DELETE'
    });
    
    const data = await res.json();
    if (res.ok) {
      console.log("Project deleted:", data.message);
      loadProjects();
    } else {
      alert(data.detail || "Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    alert("Error: " + error.message);
  }
}

// Load sidebar items (recursive support for folders)
let createTargetPath = null; // when creating file inside a folder

async function loadItems(path = "", parentUl = null) {
  if (!parentUl) parentUl = tree;
  
  try {
  const res = await fetch(`${API}/items?email=${encodeURIComponent(fileOwner || userEmail)}${path ? `&path=${encodeURIComponent(path)}` : ""}&viewer=${encodeURIComponent(viewerEmail || userEmail)}`);
    console.log("Items response status:", res.status, "path=", path);
    const data = await res.json();

    // Clear only the list items, not the parent UL itself
    const existingItems = parentUl.querySelectorAll(':scope > li');
    existingItems.forEach(item => item.remove());

    data.items.forEach(i => {
      const li = document.createElement("li");
      li.className = i.type;

      if (i.type === "folder") {
        // Folder node with expand/collapse and + button
        const folderName = i.name;
        
        // Create folder label with icon and name
        const folderLabel = document.createElement('div');
        folderLabel.className = 'folder-label';
        
        const folderIcon = document.createElement('span');
        folderIcon.textContent = '📁';
        folderIcon.style.marginRight = '6px';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = folderName;
        nameSpan.style.cursor = 'pointer';
        nameSpan.className = 'folder-name';

        folderLabel.appendChild(folderIcon);
        folderLabel.appendChild(nameSpan);

        // Actions for the folder
        const actionsSpan = document.createElement('span');
        actionsSpan.className = 'folder-actions';

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.title = 'Create file in this folder';
        plusBtn.className = 'small-btn';

        actionsSpan.appendChild(plusBtn);

        // Wrapper for label + actions on same line
        const folderRow = document.createElement('div');
        folderRow.className = 'folder-row';
        folderRow.appendChild(folderLabel);
        folderRow.appendChild(actionsSpan);

        li.appendChild(folderRow);

        // child UL for nested items (initially hidden until expanded)
        const childUl = document.createElement('ul');
        childUl.className = 'nested-list hidden';
        li.appendChild(childUl);

        // click folder name to toggle expand/collapse
        nameSpan.onclick = async (e) => {
          e.stopPropagation();
          const fullPath = path ? `${path}/${folderName}` : folderName;
          if (childUl.classList.contains('hidden')) {
            // expand: load items into childUl
            childUl.classList.remove('hidden');
            await loadItems(fullPath, childUl);
          } else {
            // collapse
            childUl.classList.add('hidden');
            childUl.innerHTML = '';
          }
        };

        // plus button to create file inside this folder
        plusBtn.onclick = (e) => {
          e.stopPropagation();
          createTargetPath = path ? `${path}/${folderName}` : folderName;
          openModal('file');
        };

      } else {
        // file node
        const fileName = i.name;
        
        // Create file row with icon, name, and actions
        const fileRow = document.createElement('div');
        fileRow.style.display = 'flex';
        fileRow.style.alignItems = 'center';
        fileRow.style.justifyContent = 'space-between';
        fileRow.style.width = '100%';
        
        const fileLabel = document.createElement('div');
        fileLabel.style.display = 'flex';
        fileLabel.style.alignItems = 'center';
        fileLabel.style.flex = '1';
        fileLabel.style.cursor = 'pointer';
        
        // Get appropriate icon based on file extension
        let fileIcon = '📄';
        if (fileName.endsWith('.py')) {
          fileIcon = '🐍';
        } else if (fileName.endsWith('.html')) {
          fileIcon = '🌐';
        } else if (fileName.endsWith('.css')) {
          fileIcon = '🎨';
        } else if (fileName.endsWith('.js')) {
          fileIcon = '⚡';
        } else if (fileName.endsWith('.json')) {
          fileIcon = '{}';
        }
        
        const iconSpan = document.createElement('span');
        iconSpan.textContent = fileIcon;
        iconSpan.style.marginRight = '6px';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = fileName;
        
        fileLabel.appendChild(iconSpan);
        fileLabel.appendChild(nameSpan);
        
        const fullPath = path ? `${path}/${fileName}` : fileName;
        
        fileLabel.onclick = (e) => {
          e.stopPropagation();
          openFile(fullPath);
        };
        
        fileRow.appendChild(fileLabel);
        
        // Add run button for Python files
        if (fileName.endsWith('.py')) {
          const runBtn = document.createElement('button');
          runBtn.textContent = '▶ Run';
          runBtn.style.padding = '4px 8px';
          runBtn.style.fontSize = '11px';
          runBtn.style.backgroundColor = '#10b981';
          runBtn.style.color = '#fff';
          runBtn.style.border = 'none';
          runBtn.style.borderRadius = '4px';
          runBtn.style.cursor = 'pointer';
          runBtn.style.marginLeft = '8px';
          runBtn.style.whiteSpace = 'nowrap';
          
          runBtn.onclick = (e) => {
            e.stopPropagation();
            runPythonFile(fullPath);
          };
          
          fileRow.appendChild(runBtn);
        }
        
        li.appendChild(fileRow);
      }

      parentUl.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading items:", error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  userEmail = getEmail();
  if (userEmail) {
    userEmailDisplay.textContent = userEmail;
    
    // Request notification permission for deadline alerts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Determine view and join params from URL
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    // `fileOwner` controls whose files/folders are displayed. If `view` is present use it.
    fileOwner = params.get('view') || userEmail;

    // show which workspace files are being viewed (helpful for verification)
    const foEl = document.getElementById('fileOwnerDisplay');
    if (foEl) {
      if (fileOwner && fileOwner !== userEmail) {
        foEl.textContent = `Viewing files of: ${fileOwner}`;
      } else {
        foEl.textContent = `Viewing your own workspace`;
      }
    }

    // show which team chat is active
    const chatTeamEl = document.getElementById('chatTeamIndicator');
    if (chatTeamEl) {
      if (fileOwner && fileOwner !== userEmail) {
        chatTeamEl.textContent = `💬 Team Chat (${fileOwner})`;
      } else {
        chatTeamEl.textContent = `💬 Team Chat (${userEmail})`;
      }
    }

    if (joinCode) {
      // Auto-join with the provided code
      autoJoinWorkspace(joinCode, userEmail);
    } else {
      // Normal loading
      loadItems();
      loadProjects();
      loadWorkspaceCode();
    }
    // Load team members list for the current workspace
    loadTeamMembers();

    // Viewer identity for chat = the currently logged-in user (userEmail)
    // This ensures messages show the correct sender
    viewerEmail = userEmail;

    // Connect WebSocket to the CURRENT workspace being viewed (own or joined)
    // This ensures all team members chat in the same room AND see file/member updates
    const chatWorkspaceRoom = fileOwner || userEmail;
    if (chatWorkspaceRoom && viewerEmail) {
      connectWebSocket(chatWorkspaceRoom, viewerEmail);
    }
    
    // populate AI model selector
    if (document.getElementById('aiModel')) {
      loadAIModels();
    }
  }
});

document.getElementById("newFolder").onclick = () => { createTargetPath = null; openModal("folder"); };
document.getElementById("newFile").onclick = () => { createTargetPath = null; openModal("file"); };

// New Project button handler
const newProjectBtn = document.getElementById("newProjectBtn");
if (newProjectBtn) {
  newProjectBtn.onclick = () => { openModal("project"); };
}

document.getElementById("saveBtn").onclick = saveFile;
document.getElementById("deleteBtn").onclick = async () => {
  if (!currentFile) { alert('No file selected to delete'); return; }
  if (!confirm(`Delete "${currentFile}"? This cannot be undone.`)) return;

  try {
    const response = await fetch(`${API}/file/${encodeURIComponent(currentFile)}?email=${encodeURIComponent(fileOwner || userEmail)}&actor=${encodeURIComponent(viewerEmail || userEmail)}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message || 'File deleted');
      // clear editor and reload
      currentFile = null;
      currentFileName.textContent = 'No file selected';
      codeEditor.value = '';
      loadItems();
    } else {
      alert(data.detail || 'Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Error deleting file: ' + error.message);
  }
};

// Logout button
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem('userEmail');
  window.location.href = 'login.html';
};

// Clear Terminal button
const clearTerminalBtn = document.getElementById("clearTerminal");
if (clearTerminalBtn) {
  clearTerminalBtn.onclick = () => {
    document.getElementById("terminalOutput").textContent = '';
  };
}

// Right Panel Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    const tabName = btn.dataset.tab;
    
    // Remove active from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked tab and its content
    btn.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  };
});

// Load and display workspace code
async function loadWorkspaceCode() {
  try {
    const res = await fetch(`${API}/workspace/code?email=${encodeURIComponent(userEmail)}`);
    const data = await res.json();
    
    console.log("Workspace code response:", { status: res.status, data });
    
    if (res.ok && data.ok) {
      document.getElementById("workspaceCode").value = data.code;
    } else if (res.status === 404) {
      // User not found, create them first
      console.log("User not found, creating workspace code anyway...");
      document.getElementById("workspaceCode").value = "N/A";
    } else {
      console.error("Error getting workspace code:", data.detail);
      document.getElementById("workspaceCode").value = "Error";
    }
  } catch (error) {
    console.error("Error loading workspace code:", error);
    document.getElementById("workspaceCode").value = "Error";
  }
}

// Copy workspace code
document.getElementById("copyWorkspaceCodeBtn").onclick = () => {
  const codeInput = document.getElementById("workspaceCode");
  codeInput.select();
  document.execCommand("copy");
  
  const btn = document.getElementById("copyWorkspaceCodeBtn");
  const originalText = btn.textContent;
  btn.textContent = "✓ COPIED";
  btn.style.backgroundColor = "#06b6d4";
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.backgroundColor = "#10b981";
  }, 2000);
};

// Generate shareable link
document.getElementById("generateLinkBtn").onclick = () => {
  const code = document.getElementById("workspaceCode").value;
  if (!code) {
    alert("Workspace code not loaded yet. Please wait.");
    return;
  }
  
  // Generate link with code as parameter
  const baseUrl = window.location.origin + window.location.pathname;
  const shareLink = `${baseUrl}?join=${encodeURIComponent(code)}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareLink).then(() => {
    const btn = document.getElementById("generateLinkBtn");
    const originalText = btn.textContent;
    btn.textContent = "✓ LINK COPIED!";
    btn.style.backgroundColor = "#06b6d4";
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = "#3b82f6";
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy link:", err);
    alert("Failed to copy link. Please try again.");
  });
};

// Auto-join workspace when link is clicked
async function autoJoinWorkspace(code, memberEmail) {
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #0f172a; border: 2px solid #10b981; padding: 30px; border-radius: 10px; z-index: 9999; text-align: center; color: #a7f3d0; font-size: 16px;';
  msgDiv.innerHTML = `
    <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">⏳ Joining workspace...</p>
    <p style="margin: 0;">Code: ${code}</p>
  `;
  document.body.appendChild(msgDiv);
  
  try {
    const res = await fetch(`${API}/workspace/join?code=${encodeURIComponent(code)}&member_email=${encodeURIComponent(memberEmail)}`, {
      method: "POST"
    });
    
    const data = await res.json();
    
    if (res.ok) {
      msgDiv.innerHTML = `
        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">✓ Success!</p>
        <p style="margin: 0 0 10px 0;">Redirecting to ${data.workspace_owner}'s workspace...</p>
        <p style="margin: 0; font-size: 12px; color: #888;">Please wait...</p>
      `;
      
      setTimeout(() => {
        // keep the current member as the logged-in email, and set `view` to the joined workspace owner
        localStorage.setItem('userEmail', memberEmail);
        window.location.href = `workspace.html?email=${encodeURIComponent(memberEmail)}&view=${encodeURIComponent(data.workspace_owner)}`;
      }, 2000);
    } else {
      msgDiv.style.borderColor = '#ef4444';
      msgDiv.style.color = '#fca5a5';
      msgDiv.innerHTML = `
        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">❌ Failed to Join</p>
        <p style="margin: 0; color: #fca5a5;">${data.detail || 'Invalid workspace code'}</p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">Redirecting back...</p>
      `;
      
      setTimeout(() => {
        document.body.removeChild(msgDiv);
        loadItems();
        loadWorkspaceCode();
      }, 3000);
    }
  } catch (error) {
    msgDiv.style.borderColor = '#ef4444';
    msgDiv.style.color = '#fca5a5';
    msgDiv.innerHTML = `
      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">❌ Error</p>
      <p style="margin: 0; color: #fca5a5;">${error.message}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px;">Redirecting back...</p>
    `;
    
    setTimeout(() => {
      document.body.removeChild(msgDiv);
      loadItems();
      loadWorkspaceCode();
    }, 3000);
  }
}

// Join workspace with code
document.getElementById("joinWorkspaceBtn").onclick = async () => {
  const code = document.getElementById("joinWorkspaceCodeInput").value.trim().toUpperCase();
  const msgDiv = document.getElementById("joinWorkspaceMessage");
  
  if (!code) {
    msgDiv.style.display = "block";
    msgDiv.style.backgroundColor = "#7f1d1d";
    msgDiv.style.color = "#fca5a5";
    msgDiv.textContent = "Please enter a workspace code";
    return;
  }
  
  try {
    const res = await fetch(`${API}/workspace/join?code=${encodeURIComponent(code)}&member_email=${encodeURIComponent(userEmail)}`, {
      method: "POST"
    });
    
    const data = await res.json();
    
    if (res.ok) {
      msgDiv.style.display = "block";
      msgDiv.style.backgroundColor = "#065f46";
      msgDiv.style.color = "#a7f3d0";
      msgDiv.textContent = `✓ Success! Redirecting to ${data.workspace_owner}'s workspace...`;
      
      // Redirect to workspace owner's workspace after 2 seconds
      setTimeout(() => {
        // preserve the logged-in user's email, show the target workspace files via `view`
        localStorage.setItem('userEmail', userEmail);
        window.location.href = `workspace.html?email=${encodeURIComponent(userEmail)}&view=${encodeURIComponent(data.workspace_owner)}`;
      }, 2000);
    } else {
      msgDiv.style.display = "block";
      msgDiv.style.backgroundColor = "#7f1d1d";
      msgDiv.style.color = "#fca5a5";
      msgDiv.textContent = "❌ " + (data.detail || "Failed to join workspace");
    }
  } catch (error) {
    msgDiv.style.display = "block";
    msgDiv.style.backgroundColor = "#7f1d1d";
    msgDiv.style.color = "#fca5a5";
    msgDiv.textContent = "❌ Error: " + error.message;
  }
};

// Invite Team

  // Show Workspace Code
  document.getElementById("showWorkspaceCodeBtn").onclick = () => {
    const codeSection = document.getElementById("workspaceCodeSection");
    codeSection.style.display = "block";
    document.getElementById("showWorkspaceCodeBtn").style.display = "none";
  };

  // Hide Workspace Code
  document.getElementById("hideWorkspaceCodeBtn").onclick = () => {
    const codeSection = document.getElementById("workspaceCodeSection");
    codeSection.style.display = "none";
    document.getElementById("showWorkspaceCodeBtn").style.display = "block";
  };
document.getElementById("copyKeyBtn").onclick = () => {
  const keyInput = document.getElementById("inviteKey");
  keyInput.select();
  document.execCommand("copy");
  const msg = document.getElementById("inviteMessage");
  msg.style.color = "green";
  msg.textContent = "✓ Invitation key copied!";
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
};

document.getElementById("regenerateKeyBtn").onclick = async () => {
  try {
    const res = await fetch(`${API}/team/generate-invite-key?email=${encodeURIComponent(userEmail)}`, {
      method: "POST"
    });
    const data = await res.json();
    document.getElementById("inviteKey").value = data.invitation_key;
    
    const msg = document.getElementById("inviteMessage");
    msg.style.color = "green";
    msg.textContent = "✓ New invitation key generated!";
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 2000);
  } catch (error) {
    const msg = document.getElementById("inviteMessage");
    msg.style.color = "red";
    msg.textContent = "Error: " + error.message;
    msg.style.display = "block";
  }
};

document.getElementById("joinTeamBtn").onclick = async () => {
  const key = document.getElementById("joinKeyInput").value.trim().toUpperCase();
  const msg = document.getElementById("inviteMessage");
  
  if (!key || key.length !== 8) {
    msg.style.color = "red";
    msg.textContent = "Please enter a valid 8-character invitation key";
    msg.style.display = "block";
    return;
  }
  
  try {
    const res = await fetch(`${API}/team/join-team`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitation_key: key,
        member_email: userEmail
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      msg.style.color = "green";
      msg.textContent = `✓ Success! Redirecting to ${data.team_lead}'s workspace...`;
      msg.style.display = "block";
      
      // Redirect to team lead's workspace after 2 seconds
      setTimeout(() => {
        localStorage.setItem('userEmail', data.team_lead);
        window.location.href = `workspace.html?email=${encodeURIComponent(data.team_lead)}`;
      }, 2000);
    } else {
      msg.style.color = "red";
      msg.textContent = data.detail || "Failed to join team";
      msg.style.display = "block";
    }
  } catch (error) {
    msg.style.color = "red";
    msg.textContent = "Error: " + error.message;
    msg.style.display = "block";
  }
};

document.getElementById("closeInviteBtn").onclick = () => {
  document.getElementById("inviteModal").classList.add("hidden");
};

// Leave Workspace handler
document.getElementById('leaveWorkspaceBtn').onclick = async () => {
  const workspaceEmail = getEmail();
  if (!viewerEmail) {
    alert('Viewer identity not set');
    return;
  }

  if (!confirm(`Leave workspace ${workspaceEmail}? You will be redirected to your own workspace.`)) return;

  try {
    const res = await fetch(`${API}/workspace/leave?workspace=${encodeURIComponent(workspaceEmail)}&member_email=${encodeURIComponent(viewerEmail)}`, {
      method: 'POST'
    });
    const data = await res.json();
    if (res.ok) {
      // close ws if open
      try { if (ws) ws.close(); } catch(e) {}
      // redirect to member's own workspace
      localStorage.setItem('userEmail', viewerEmail);
      window.location.href = `workspace.html?email=${encodeURIComponent(viewerEmail)}`;
    } else {
      alert(data.detail || 'Failed to leave workspace');
    }
  } catch (e) {
    console.error('Error leaving workspace', e);
    alert('Error leaving workspace: ' + e.message);
  }
};

// Team Chat
document.getElementById("chatSendBtn").onclick = () => {
  const msg = document.getElementById("chatInput").value.trim();
  if (!msg) return;

  // Determine which workspace chat to send to:
  // - If viewing a joined workspace (fileOwner differs from userEmail), send to that workspace
  // - Otherwise send to own workspace
  const chatWorkspace = fileOwner || userEmail;
  console.log('CHAT SEND:', { sender: userEmail, msg, workspace: chatWorkspace, wsState: ws?.readyState });

  // send via websocket - always use ws which is now connected to current workspace
  if (ws && ws.readyState === WebSocket.OPEN) {
    const payload = JSON.stringify({ type: 'chat', sender: userEmail, text: msg });
    console.log('Sending payload via WebSocket:', payload);
    ws.send(payload);
  } else {
    // fallback: append locally if not connected
    console.warn('WebSocket NOT OPEN - appending locally. State:', ws?.readyState);
    appendChatMessage(userEmail, msg);
  }

  document.getElementById("chatInput").value = "";
};

function appendChatMessage(sender, text, ts) {
  const chatMessages = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === userEmail ? "message user" : "message other";
  const timeStr = ts ? ` <span style="font-size:11px;color:#6b7280;">${new Date(ts).toLocaleTimeString()}</span>` : '';
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}${timeStr}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderMembersFromPayload(payload) {
  try {
    const container = document.getElementById('teamMembersList');
    container.innerHTML = '';
    const owner = payload.owner;
    const connectedUsers = payload.connected || []; // List of currently connected users
    
    // Mark owner as online
    updateUserOnlineStatus(owner, true);
    
    const ownerEl = document.createElement('div');
    ownerEl.setAttribute('data-user-email', owner);
    ownerEl.setAttribute('data-user-type', 'owner');
    ownerEl.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative;';
    ownerEl.innerHTML = `
      <div style="position:relative;">
        <div style="width:34px;height:34px;border-radius:50%;background:#334155;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">${(owner[0]||'U').toUpperCase()}</div>
        <div class="online-indicator online" style="width:12px;height:12px;border-radius:50%;position:absolute;bottom:0;right:0;background:#10b981;border:2px solid #0f172a;"></div>
      </div>
      <div style="display:flex;flex-direction:column;">
        <span style="font-weight:600;color:#fff;">${owner}</span>
        <span style="font-size:12px;color:#9ca3af;">Owner</span>
      </div>
    `;
    container.appendChild(ownerEl);

    const members = payload.members || [];
    members.forEach(m => {
      const memberIsOnline = connectedUsers.includes(m);
      updateUserOnlineStatus(m, memberIsOnline);
      
      const el = document.createElement('div');
      el.setAttribute('data-user-email', m);
      el.setAttribute('data-user-type', 'member');
      el.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative;';
      el.innerHTML = `
        <div style="position:relative;">
          <div style="width:28px;height:28px;border-radius:50%;background:#0f172a;border:1px solid #334155;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-weight:600;">${(m[0]||'U').toUpperCase()}</div>
          <div class="online-indicator ${memberIsOnline ? 'online' : 'offline'}" style="width:10px;height:10px;border-radius:50%;position:absolute;bottom:-2px;right:-2px;background:${memberIsOnline ? '#10b981' : '#9ca3af'};border:2px solid #0f172a;"></div>
        </div>
        <div style="display:flex;flex-direction:column;">
          <span style="color:#cbd5e1;">${m}</span>
          <span style="font-size:12px;color:#6b7280;">Joined</span>
        </div>
      `;
      container.appendChild(el);
    });
  } catch (e) {
    console.error('Error rendering members payload', e);
  }
}

function connectWebSocket(workspaceOwner, memberEmail) {
  try {
    // Build WS URL from `API` to ensure same host/port as REST endpoints
    let url;
    try {
      // Convert http(s)://host:port -> ws(s)://host:port
      if (API.startsWith('https://')) {
        url = API.replace(/^https:/, 'wss:');
      } else if (API.startsWith('http://')) {
        url = API.replace(/^http:/, 'ws:');
      } else {
        // fallback
        url = `ws://127.0.0.1:8001`;
      }
      // append path and query
      url = `${url.replace(/\/$/, '')}/ws?workspace=${encodeURIComponent(workspaceOwner)}&user=${encodeURIComponent(memberEmail)}`;
    } catch (e) {
      // final fallback to localhost:8001
      url = `ws://127.0.0.1:8001/ws?workspace=${encodeURIComponent(workspaceOwner)}&user=${encodeURIComponent(memberEmail)}`;
    }
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected to', url);
    };

    ws.onmessage = (evt) => {
      console.log('WebSocket message received:', evt.data);
      try {
        const data = JSON.parse(evt.data);
        console.log('Parsed message type:', data.type);
        if (data.type === 'members') {
          console.log('Processing members update');
          renderMembersFromPayload(data);
        } else if (data.type === 'chat') {
          console.log('Processing chat message from', data.sender, ':', data.text);
          appendChatMessage(data.sender, data.text, data.ts);
        } else if (data.type === 'meeting') {
          console.log('Processing meeting event', data);
          showMeetingNotification(data.time, data.link);
        } else if (data.type === 'files') {
          // file/folder changes in the workspace - refresh list and optionally show brief notice
          console.log('files event received', data);
          try { loadItems(); } catch (e) { console.error('Failed to reload items on files event', e); }
          // If current file was modified, reload its info to show updated version history
          if (currentFile && data.action === 'modified') {
            try { 
              console.log('Reloading file info due to modification:', data.path);
              loadFileInfo(currentFile); 
            } catch (e) { console.error('Failed to reload file info', e); }
          }
          // small transient notice
          try {
            const msgEl = document.createElement('div');
            msgEl.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#0f172a;padding:8px 12px;border-radius:6px;border:1px solid #334155;color:#cbd5e1;font-size:12px;z-index:9999;';
            msgEl.textContent = `✓ ${data.action === 'modified' ? 'File updated' : `File ${data.action}`}`;
            document.body.appendChild(msgEl);
            setTimeout(() => msgEl.remove(), 2500);
          } catch (e) {}
        }
      } catch (e) {
        // fallback: treat as text
        console.error('Failed to parse message:', evt.data, e);
        appendChatMessage('?', evt.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      // try reconnect after a short delay
      setTimeout(() => {
        connectWebSocket(workspaceOwner, memberEmail);
      }, 3000);
    };

    ws.onerror = (err) => {
      console.warn('WebSocket error', err);
    };
  } catch (e) {
    console.error('Failed to connect websocket', e);
  }
}



// AI Assistant
document.getElementById("aiSendBtn").onclick = async () => {
  const prompt = document.getElementById("aiInput").value.trim();
  if (!prompt) return;

  const aiMessages = document.getElementById("aiMessages");
  
  // Add user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "message user";
  userMsgDiv.innerHTML = `<strong>You:</strong> ${prompt}`;
  aiMessages.appendChild(userMsgDiv);
  
  // Add loading message
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai";
  loadingDiv.innerHTML = "<strong>AI:</strong> Thinking...";
  aiMessages.appendChild(loadingDiv);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  document.getElementById("aiInput").value = "";

  try {
    const model = (document.getElementById('aiModel') && document.getElementById('aiModel').value) || 'llama3';
    const response = await fetch(`${API}/ai`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    });

    const data = await response.json();
    loadingDiv.innerHTML = `<strong>AI:</strong> ${data.response || "No response from AI"}`;
    aiMessages.scrollTop = aiMessages.scrollHeight;
  } catch (error) {
    loadingDiv.innerHTML = `<strong>AI:</strong> Error: ${error.message}`;
  }
};


// Load available AI models from backend -> Ollama
async function loadAIModels() {
  try {
    const res = await fetch(`${API}/ai/models`);
    if (!res.ok) return;
    const data = await res.json();
    const sel = document.getElementById('aiModel');
    if (!sel) return;
    sel.innerHTML = '';
    if (data.models && data.models.length) {
      data.models.forEach(m => {
        const o = document.createElement('option');
        o.value = m;
        o.textContent = m;
        sel.appendChild(o);
      });
    } else {
      const o = document.createElement('option'); o.value = 'llama3'; o.textContent = 'llama3'; sel.appendChild(o);
    }
  } catch (e) {
    console.warn('Could not load AI models', e);
  }
}

// Load and render team members (includes workspace owner)
async function loadTeamMembers() {
  try {
    // Use fileOwner to get the team members of the workspace being viewed
    const workspaceEmail = fileOwner || userEmail;
    if (!workspaceEmail) return;

    const res = await fetch(`${API}/team/info?email=${encodeURIComponent(workspaceEmail)}`);
    if (!res.ok) return;
    const data = await res.json();

    const container = document.getElementById('teamMembersList');
    container.innerHTML = '';

    // Always show workspace owner first
    const owner = data.team_lead || workspaceEmail;
    const ownerIsOnline = onlineUsers[owner] || true; // Owner is always shown as online
    const ownerEl = document.createElement('div');
    ownerEl.setAttribute('data-user-email', owner);
    ownerEl.setAttribute('data-user-type', 'owner');
    ownerEl.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative;';
    ownerEl.innerHTML = `
      <div style="position:relative;">
        <div style="width:34px;height:34px;border-radius:50%;background:#334155;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">${(owner[0]||'U').toUpperCase()}</div>
        <div class="online-indicator ${ownerIsOnline ? 'online' : 'offline'}" style="width:12px;height:12px;border-radius:50%;position:absolute;bottom:0;right:0;background:${ownerIsOnline ? '#10b981' : '#9ca3af'};border:2px solid #0f172a;"></div>
      </div>
      <div style="display:flex;flex-direction:column;">
        <span style="font-weight:600;color:#fff;">${owner}</span>
        <span style="font-size:12px;color:#9ca3af;">Owner</span>
      </div>
    `;
    container.appendChild(ownerEl);

    // then list members who joined
    const members = data.members || [];
    members.forEach(m => {
      const memberIsOnline = onlineUsers[m] || false;
      const el = document.createElement('div');
      el.setAttribute('data-user-email', m);
      el.setAttribute('data-user-type', 'member');
      el.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative;';
      el.innerHTML = `
        <div style="position:relative;">
          <div style="width:28px;height:28px;border-radius:50%;background:#0f172a;border:1px solid #334155;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-weight:600;">${(m[0]||'U').toUpperCase()}</div>
          <div class="online-indicator ${memberIsOnline ? 'online' : 'offline'}" style="width:10px;height:10px;border-radius:50%;position:absolute;bottom:-2px;right:-2px;background:${memberIsOnline ? '#10b981' : '#9ca3af'};border:2px solid #0f172a;"></div>
        </div>
        <div style="display:flex;flex-direction:column;">
          <span style="color:#cbd5e1;">${m}</span>
          <span style="font-size:12px;color:#6b7280;">Joined</span>
        </div>
      `;
      container.appendChild(el);
    });

    // Show Leave Workspace button when the viewer is a joined member (and not the owner)
    const leaveBtn = document.getElementById('leaveWorkspaceBtn');
    try {
      const membersLower = members.map(m => (m || '').toLowerCase());
      if (viewerEmail && viewerEmail.toLowerCase() !== workspaceEmail.toLowerCase() && membersLower.includes((viewerEmail||'').toLowerCase())) {
        leaveBtn.style.display = 'inline-block';
      } else {
        leaveBtn.style.display = 'none';
      }
    } catch (e) {
      leaveBtn.style.display = 'none';
    }
  } catch (e) {
    console.error('Error loading team members', e);
  }
}

// Update a team member's online status
function updateUserOnlineStatus(email, isOnline) {
  onlineUsers[email] = isOnline;
  
  // Find and update the UI element
  const userEl = document.querySelector(`[data-user-email="${email}"]`);
  if (userEl) {
    const indicator = userEl.querySelector('.online-indicator');
    if (indicator) {
      indicator.classList.toggle('online', isOnline);
      indicator.classList.toggle('offline', !isOnline);
      indicator.style.background = isOnline ? '#10b981' : '#9ca3af';
    }
  }
}

function openModal(type) {
  currentType = type;
  title.textContent = `Create New ${type}`;
  input.value = "";
  const deadlineInput = document.getElementById("projectDeadline");
  
  // Show deadline input only for projects
  if (type === "project") {
    deadlineInput.style.display = "block";
    deadlineInput.value = "";
  } else {
    deadlineInput.style.display = "none";
  }
  
  modalMessage.style.display = "none";
  modal.classList.remove("hidden");
}

document.getElementById("cancel").onclick = () => {
  modal.classList.add("hidden");
};

document.getElementById("create").onclick = async () => {
  const name = input.value.trim();
  if (!name) {
    modalMessage.textContent = "Please enter a name";
    modalMessage.style.display = "block";
    return;
  }

  // For projects, validate deadline
  if (currentType === "project") {
    const deadline = document.getElementById("projectDeadline").value;
    if (!deadline) {
      modalMessage.textContent = "Please enter a deadline";
      modalMessage.style.display = "block";
      return;
    }
    
    // Create project via API with query parameters
    try {
      const url = `${API}/project/create?name=${encodeURIComponent(name)}&deadline=${encodeURIComponent(deadline)}&email=${encodeURIComponent(fileOwner || userEmail)}&actor=${encodeURIComponent(viewerEmail || userEmail)}`;
      
      const response = await fetch(url, {
        method: "POST"
      });

      const data = await response.json();
      console.log("Create project response:", data);
      
      if (response.ok) {
        modalMessage.style.color = "green";
        modalMessage.textContent = data.message || "Project created successfully!";
        modalMessage.style.display = "block";
        
        setTimeout(() => {
          modal.classList.add("hidden");
          loadProjects();
        }, 1000);
      } else {
        modalMessage.style.color = "red";
        modalMessage.textContent = data.detail || "Failed to create project";
        modalMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error creating project:", error);
      modalMessage.style.color = "red";
      modalMessage.textContent = "Error: " + error.message;
      modalMessage.style.display = "block";
    }
    return;
  }

  // Original file/folder creation logic
  try {
    let createName = name;
    if (createTargetPath && currentType === 'file') {
      createName = `${createTargetPath}/${name}`;
    }

    const ownerEmail = fileOwner || userEmail;
    const actorEmail = viewerEmail || userEmail;
    
    console.log("Creating " + currentType, { name: createName, owner: ownerEmail, actor: actorEmail });
    
    const url = `${API}/${currentType}?name=${encodeURIComponent(createName)}&email=${encodeURIComponent(ownerEmail)}&actor=${encodeURIComponent(actorEmail)}`;
    console.log("Creating with URL:", url);
    
    const response = await fetch(url, {
      method: "POST"
    });
    
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      modalMessage.style.color = "green";
      modalMessage.textContent = data.message || `${currentType} created successfully!`;
      modalMessage.style.display = "block";
      
      setTimeout(() => {
        modal.classList.add("hidden");
        loadItems();
      }, 1000);
    } else {
      modalMessage.style.color = "red";
      modalMessage.textContent = data.detail || `Failed to create ${currentType}`;
      modalMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error creating item:", error);
    modalMessage.style.color = "red";
    modalMessage.textContent = "Error: " + error.message;
    modalMessage.style.display = "block";
  }
};






