// ---------- Section switching ----------
function showDoctorSection(name, el) {
  document.querySelectorAll('.doctor-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.doctor-section').forEach(s => s.classList.remove('active'));
  document.getElementById('dsec-' + name).classList.add('active');
}

// ---------- Modal ----------
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ---------- Appointments ----------
let doctorAppointments = [
  { id: 1, patient: 'Rohit Sharma', date: '2026-04-14', time: '10:00 AM', disease: 'Diabetes',      status: 'Confirmed'  },
  { id: 2, patient: 'Priya Patel',  date: '2026-04-14', time: '11:30 AM', disease: 'Hypertension',  status: 'Pending'    },
  { id: 3, patient: 'Anil Kumar',   date: '2026-04-14', time: '02:00 PM', disease: 'Asthma',        status: 'Completed'  },
  { id: 4, patient: 'Sneha Joshi',  date: '2026-04-15', time: '09:30 AM', disease: 'Fever',         status: 'Pending'    },
];

function statusBadge(status) {
  if (status === 'Confirmed')  return `<span class="badge green">${status}</span>`;
  if (status === 'Pending')    return `<span class="badge amber">${status}</span>`;
  if (status === 'Completed')  return `<span class="badge blue">${status}</span>`;
  return status;
}

function renderAppointments(list) {
  const tbody = document.getElementById('doctor-appt-body');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#aaa;padding:2rem;">No appointments found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${a.patient}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.disease}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        <select onchange="updateStatus(${a.id}, this.value)"
          style="height:30px; padding:0 8px; border:1px solid #dde3ec; border-radius:6px; font-size:12px; outline:none;">
          <option ${a.status==='Pending'   ? 'selected' : ''}>Pending</option>
          <option ${a.status==='Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option ${a.status==='Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateStatus(id, newStatus) {
  doctorAppointments = doctorAppointments.map(a =>
    a.id === id ? { ...a, status: newStatus } : a
  );
  filterAppointments();
}

function filterAppointments() {
  const val = document.getElementById('appt-filter').value;
  const filtered = val === 'all'
    ? doctorAppointments
    : doctorAppointments.filter(a => a.status === val);
  renderAppointments(filtered);
}

// ---------- Medical Records ----------
let medicalRecords = [
  { id: 1, patient: 'Rohit Sharma', diagnosis: 'Type 2 Diabetes',  prescription: 'Metformin 500mg', date: '2026-04-10', notes: 'Follow up in 2 weeks' },
  { id: 2, patient: 'Anil Kumar',   diagnosis: 'Chronic Asthma',   prescription: 'Salbutamol',      date: '2026-04-12', notes: 'Avoid dust exposure'  },
];
let nextRecordId = 3;

function renderRecords(list) {
  const tbody = document.getElementById('records-body');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#aaa;padding:2rem;">No records found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r.patient}</td>
      <td>${r.diagnosis}</td>
      <td>${r.prescription}</td>
      <td>${r.date}</td>
      <td><button class="btn-danger" onclick="deleteRecord(${r.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addRecord() {
  const patient      = document.getElementById('r-patient').value.trim();
  const date         = document.getElementById('r-date').value;
  const diagnosis    = document.getElementById('r-diagnosis').value.trim();
  const prescription = document.getElementById('r-prescription').value.trim();
  const notes        = document.getElementById('r-notes').value.trim();

  if (!patient || !date || !diagnosis || !prescription) {
    alert('Please fill in all required fields.');
    return;
  }

  medicalRecords.push({ id: nextRecordId++, patient, diagnosis, prescription, date, notes });
  renderRecords(medicalRecords);
  closeModal('record-modal');

  ['r-patient','r-date','r-diagnosis','r-prescription','r-notes']
    .forEach(id => document.getElementById(id).value = '');
}

function deleteRecord(id) {
  if (!confirm('Delete this record?')) return;
  medicalRecords = medicalRecords.filter(r => r.id !== id);
  renderRecords(medicalRecords);
}

function filterRecords() {
  const q = document.getElementById('record-search').value.toLowerCase();
  const filtered = medicalRecords.filter(r =>
    r.patient.toLowerCase().includes(q)
  );
  renderRecords(filtered);
}

// ---------- Init ----------
renderAppointments(doctorAppointments);
renderRecords(medicalRecords);