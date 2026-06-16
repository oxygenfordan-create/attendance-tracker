// Global state
let students = [];
let attendance = {};
let webAppUrl = localStorage.getItem('webAppUrl') || '';

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    if (webAppUrl) {
        console.log('Web App URL loaded from storage');
    }
});

/**
 * Load roster from textarea input
 */
function loadRoster() {
    const input = document.getElementById('rosterInput').value.trim();
    const classNameInput = document.getElementById('classNameInput').value.trim();

    if (!input) {
        showMessage('configMessage', 'Please paste student names', 'error');
        return;
    }

    if (!classNameInput) {
        showMessage('configMessage', 'Please enter a class name', 'error');
        return;
    }

    // Parse student names
    students = input
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

    if (students.length === 0) {
        showMessage('configMessage', 'No valid student names found', 'error');
        return;
    }

    // Initialize attendance object
    attendance = {};
    students.forEach(student => {
        attendance[student] = null; // null = not marked, 'present', 'absent', 'late'
    });

    // Update UI
    document.getElementById('classDisplay').textContent = `Class: ${classNameInput}`;
    renderStudentList();
    showAttendanceSection();
    showMessage('configMessage', `Loaded ${students.length} students`, 'success');
}

/**
 * Render the student list with status buttons
 */
function renderStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const status = attendance[student];
        const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';
        const statusClass = status || 'unmarked';

        const studentItem = document.createElement('div');
        studentItem.className = `student-item ${statusClass}`;
        studentItem.innerHTML = `
            <span class="student-name">${student}</span>
            <div class="status-buttons">
                <button class="status-btn present ${status === 'present' ? 'active' : ''}" onclick="markAttendance('${escapeQuotes(student)}', 'present')">✓ Present</button>
                <button class="status-btn absent ${status === 'absent' ? 'active' : ''}" onclick="markAttendance('${escapeQuotes(student)}', 'absent')">✗ Absent</button>
                <button class="status-btn late ${status === 'late' ? 'active' : ''}" onclick="markAttendance('${escapeQuotes(student)}', 'late')">⏱ Late</button>
            </div>
            <span class="student-status">${statusText}</span>
        `;
        studentList.appendChild(studentItem);
    });

    updateStats();
}

/**
 * Mark attendance for a student
 */
function markAttendance(student, status) {
    // Toggle: if already marked with this status, unmark it
    if (attendance[student] === status) {
        attendance[student] = null;
    } else {
        attendance[student] = status;
    }
    renderStudentList();
}

/**
 * Update attendance statistics
 */
function updateStats() {
    const presentCount = Object.values(attendance).filter(s => s === 'present').length;
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
    const lateCount = Object.values(attendance).filter(s => s === 'late').length;

    document.getElementById('presentCount').textContent = presentCount;
    document.getElementById('absentCount').textContent = absentCount;
    document.getElementById('lateCount').textContent = lateCount;
}

/**
 * Submit attendance to Google Sheets
 */
function submitAttendance() {
    if (!webAppUrl) {
        showMessage('feedbackMessage', 'Web App URL not configured. Click ⚙️ to set it up.', 'error');
        return;
    }

    const unmarked = students.filter(s => attendance[s] === null);
    if (unmarked.length > 0) {
        const confirmSubmit = confirm(
            `${unmarked.length} student(s) not marked:\n${unmarked.join(', ')}\n\nSubmit anyway?`
        );
        if (!confirmSubmit) return;
    }

    // Show loading state
    showMessage('feedbackMessage', '⏳ Submitting attendance...', 'info');

    // Prepare data
    const records = students.map(student => ({
        name: student,
        status: attendance[student] || 'unmarked'
    }));

    const payload = JSON.stringify({ records });

    // Send to Google Sheets via Apps Script
    fetch(webAppUrl, {
        method: 'POST',
        body: payload
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            showMessage('feedbackMessage', '✓ Attendance submitted successfully!', 'success');
            setTimeout(() => {
                resetSession();
            }, 2000);
        } else {
            showMessage('feedbackMessage', `Error: ${data.message || 'Unknown error'}`, 'error');
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        showMessage('feedbackMessage', `Error submitting attendance: ${error.message}. Check console (F12) for details.`, 'error');
    });
}

/**
 * Export attendance to CSV
 */
function exportToCSV() {
    const className = document.getElementById('classNameInput').value || 'Attendance';
    const timestamp = new Date().toLocaleString();
    
    let csv = `Class: ${className}\nDate/Time: ${timestamp}\n\nStudent Name,Status\n`;
    
    students.forEach(student => {
        const status = attendance[student] || 'unmarked';
        csv += `${student},${status}\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showMessage('feedbackMessage', 'Attendance exported as CSV', 'success');
}

/**
 * Reset session
 */
function resetSession() {
    document.getElementById('rosterInput').value = '';
    document.getElementById('classNameInput').value = '';
    document.getElementById('studentList').innerHTML = '';
    students = [];
    attendance = {};
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('configMessage').textContent = '';
    document.getElementById('feedbackMessage').textContent = '';
}

/**
 * Show attendance section
 */
function showAttendanceSection() {
    document.getElementById('attendanceSection').style.display = 'block';
}

/**
 * Show message
 */
function showMessage(elementId, text, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = text;
    messageEl.className = `message show ${type}`;
    if (type === 'success') {
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 4000);
    }
}

/**
 * Save Web App URL
 */
function saveWebAppUrl() {
    const url = document.getElementById('webAppUrl').value.trim();
    if (!url) {
        alert('Please enter a Web App URL');
        return;
    }
    localStorage.setItem('webAppUrl', url);
    webAppUrl = url;
    alert('Web App URL saved!');
    closeModal();
}

/**
 * Open configuration modal
 */
function openConfigModal() {
    document.getElementById('configModal').style.display = 'flex';
    document.getElementById('webAppUrl').value = webAppUrl;
}

/**
 * Close configuration modal
 */
function closeModal() {
    document.getElementById('configModal').style.display = 'none';
}

/**
 * Close modal when clicking outside
 */
window.onclick = function(event) {
    const modal = document.getElementById('configModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

/**
 * Helper: Escape quotes in student names for onclick
 */
function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}
