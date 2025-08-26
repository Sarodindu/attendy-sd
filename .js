let currentUser = null;

function login() {
  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  currentUser = {
    role,
    username,
    password,
    name: username.charAt(0).toUpperCase() + username.slice(1)
  };

  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.remove('hidden');
  document.getElementById('userWelcome').textContent = `${currentUser.name} (${currentUser.role})`;
}

function logout() {
  currentUser = null;
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('dashboardPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
}

function showSection(sectionId) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('dashboardPage').classList.add('hidden');
  document.getElementById(sectionId).classList.remove('hidden');
}

function goHome() {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('dashboardPage').classList.remove('hidden');
}

function markAllPresent() {
  const checkboxes = document.querySelectorAll('#studentList input[type="checkbox"]');
  const statusSelects = document.querySelectorAll('#studentList .status-select');
  
  checkboxes.forEach(box => box.checked = true);
  statusSelects.forEach(select => select.value = "Present");
}

function clearAll() {
  const checkboxes = document.querySelectorAll('#studentList input[type="checkbox"]');
  const statusSelects = document.querySelectorAll('#studentList .status-select');
  const noteInputs = document.querySelectorAll('#studentList .note-input');
  
  checkboxes.forEach(box => box.checked = false);
  statusSelects.forEach(select => select.value = "Present");
  noteInputs.forEach(input => input.value = "");
}

function submitAttendance() {
  const classSelected = document.getElementById('classSelect').value;
  const dateSelected = document.getElementById('attendanceDate').value;
  
  if (!dateSelected) {
    alert("Please select a date");
    return;
  }
  
  // In a real app, you would send this data to a server
  alert("✅ Attendance saved successfully!");
  goHome();
}

function filterHistory() {
  const date = document.getElementById('filterDate').value;
  const className = document.getElementById('filterClass').value;
  const studentName = document.getElementById('filterStudent').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;

  const rows = document.querySelectorAll('#historyTableBody tr');
  let summary = { Present: 0, Absent: 0, Late: 0, Excused: 0 };

  rows.forEach(row => {
    const cells = Array.from(row.children);
    const rDate = cells[0].textContent;
    const rClass = cells[1].textContent.toLowerCase();
    const rStudent = cells[2].textContent.toLowerCase();
    const rStatus = cells[3].textContent.toLowerCase();
    
    const matchesDate = !date || rDate.includes(date);
    const matchesClass = className === 'All' || rClass === className.toLowerCase();
    const matchesStudent = !studentName || rStudent.includes(studentName);
    const matchesStatus = status === 'All' || rStatus === status.toLowerCase();

    const show = matchesDate && matchesClass && matchesStudent && matchesStatus;
    row.style.display = show ? '' : 'none';

    if (show) {
      const statusKey = rStatus.charAt(0).toUpperCase() + rStatus.slice(1);
      if (summary.hasOwnProperty(statusKey)) {
        summary[statusKey]++;
      }
    }
  });

  document.getElementById('summaryStats').textContent = 
    `Summary: Present: ${summary.Present} | Absent: ${summary.Absent} | Late: ${summary.Late} | Excused: ${summary.Excused}`;
}

function exportCSV() {
  const visibleRows = Array.from(document.querySelectorAll("#historyTableBody tr"))
    .filter(row => row.style.display !== 'none');
  
  if (visibleRows.length === 0) {
    alert("No data to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Date,Class,Student,Status,Note\n";
  visibleRows.forEach(row => {
    let rowData = Array.from(row.children).map(td => `"${td.textContent}"`).join(",");
    csvContent += rowData + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "attendance_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('attendanceDate').value = today;
  document.getElementById('filterDate').value = today;
});