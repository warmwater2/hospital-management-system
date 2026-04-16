// ---------- Section switching ----------
function showRecSection(name, el) {
  document.querySelectorAll('.rec-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.rec-section').forEach(s => s.classList.remove('active'));
  document.getElementById('rsec-' + name).classList.add('active');
}

// ---------- Modal ----------
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ---------- Patients ----------
let recPatients = [
  { id: 1, name: 'Rohit Sharma', age: 34, gender: 'Male',   contact: '9876543210', disease: 'Diabetes',     date: '2026-04-10' },
  { id: 2, name: 'Priya Patel',  age: 28, gender: 'Female', contact: '9123456780', disease: 'Hypertension',  date: '2026-04-11' },
];
let nextRecPatientId = 3;

function statusBadge(status) {
  if (status === 'Confirmed')  return `<span class="badge green">${status}</span>`;
  if (status === 'Pending')    return `<span class="badge amber">${status}</span>`;
  if (status === 'Completed')  return `<span class="badge blue">${status}</span>`;
  return status;
}

function renderRecPatients(list) {
  const tbody = document.getElementById('rec-patient-body');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#aaa;padding:2rem;">No patients found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>
      <td>${p.contact}</td>
      <td>${p.disease}</td>
      <td>${p.date}</td>
      <td><button class="btn-danger" onclick="recDeletePatient(${p.id})">Delete</button></td>
    </tr>
  `).join('');
  updateSummary();
}

function recAddPatient() {
  const name    = document.getElementById('rp-name').value.trim();
  const age     = document.getElementById('rp-age').value.trim();
  const gender  = document.getElementById('rp-gender').value;
  const contact = document.getElementById('rp-contact').value.trim();
  const disease = document.getElementById('rp-disease').value.trim();
  const date    = document.getElementById('rp-date').value;

  if (!name || !age || !gender || !contact || !disease || !date) {
    alert('Please fill in all fields.');
    return;
  }

  recPatients.push({ id: nextRecPatientId++, name, age, gender, contact, disease, date });
  renderRecPatients(recPatients);
  closeModal('rec-patient-modal');
  ['rp-name','rp-age','rp-contact','rp-disease','rp-date'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('rp-gender').value = '';
}

function recDeletePatient(id) {
  if (!confirm('Delete this patient?')) return;
  recPatients = recPatients.filter(p => p.id !== id);
  renderRecPatients(recPatients);
}

function recFilterPatients() {
  const q = document.getElementById('rec-patient-search').value.toLowerCase();
  const filtered = recPatients.filter(p =>
    p.name.toLowerCase().includes(q) || p.disease.toLowerCase().includes(q)
  );
  renderRecPatients(filtered);
}

// ---------- Appointments ----------
let recAppointments = [
  { id: 1, patient: 'Rohit Sharma', doctor: 'Dr. Mehta', date: '2026-04-14', time: '10:00', status: 'Confirmed' },
  { id: 2, patient: 'Priya Patel',  doctor: 'Dr. Singh', date: '2026-04-14', time: '11:30', status: 'Pending'   },
];
let nextRecApptId = 3;

function renderRecAppointments(list) {
  const tbody = document.getElementById('rec-appt-body');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#aaa;padding:2rem;">No appointments found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${a.patient}</td>
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${statusBadge(a.status)}</td>
      <td><button class="btn-danger" onclick="recDeleteAppt(${a.id})">Cancel</button></td>
    </tr>
  `).join('');
  updateSummary();
}

function recAddAppointment() {
  const patient = document.getElementById('ra-patient').value.trim();
  const doctor  = document.getElementById('ra-doctor').value.trim();
  const date    = document.getElementById('ra-date').value;
  const time    = document.getElementById('ra-time').value;
  const status  = document.getElementById('ra-status').value;

  if (!patient || !doctor || !date || !time || !status) {
    alert('Please fill in all fields.');
    return;
  }

  recAppointments.push({ id: nextRecApptId++, patient, doctor, date, time, status });
  renderRecAppointments(recAppointments);
  closeModal('rec-appt-modal');
  ['ra-patient','ra-doctor','ra-date','ra-time'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('ra-status').value = '';
}

function recDeleteAppt(id) {
  if (!confirm('Cancel this appointment?')) return;
  recAppointments = recAppointments.filter(a => a.id !== id);
  renderRecAppointments(recAppointments);
}

function recFilterAppointments() {
  const q = document.getElementById('rec-appt-search').value.toLowerCase();
  const filtered = recAppointments.filter(a =>
    a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q)
  );
  renderRecAppointments(filtered);
}

// ---------- Summary ----------
function updateSummary() {
  const tp = document.getElementById('rec-total-patients');
  const ta = document.getElementById('rec-total-appts');
  if (tp) tp.textContent = recPatients.length;
  if (ta) ta.textContent = recAppointments.length;
}

// ---------- Init ----------
renderRecPatients(recPatients);
renderRecAppointments(recAppointments);