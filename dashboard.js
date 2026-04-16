// ---------- Sidebar navigation ----------
function showSection(name, el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  const titles = {
    dashboard: 'Dashboard',
    patients: 'Patients',
    doctors: 'Doctors',
    appointments: 'Appointments',
    billing: 'Billing',
    records: 'Medical Records'
  };
  document.getElementById('page-heading').textContent = titles[name];
}

// ---------- Modal ----------
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ---------- Patients ----------
// ---------- Patients ----------
let patients = [];

// Load patients from backend
async function loadPatients() {
  const res = await fetch("http://localhost:5000/patients");
  patients = await res.json();
  renderPatients(patients);
}

// Render patients in table
function renderPatients(list) {
  const tbody = document.getElementById('patient-table-body');

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#aaa; padding:2rem;">No patients found.</td></tr>`;
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
      <td>
        <button class="btn-danger" onclick="deletePatient(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Add patient (POST API)
async function addPatient() {
  const patient = {
    name: document.getElementById('p-name').value.trim(),
    age: document.getElementById('p-age').value.trim(),
    gender: document.getElementById('p-gender').value,
    contact: document.getElementById('p-contact').value.trim(),
    disease: document.getElementById('p-disease').value.trim(),
    date: document.getElementById('p-date').value
  };

  if (!patient.name || !patient.age || !patient.gender || !patient.contact || !patient.disease || !patient.date) {
    alert('Please fill in all fields.');
    return;
  }

  await fetch("http://localhost:5000/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(patient)
  });

  closeModal('patient-modal');
  loadPatients();

  // Clear form
  ['p-name','p-age','p-contact','p-disease','p-date'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('p-gender').value = '';
}

// Delete patient (DELETE API)
async function deletePatient(id) {
  if (!confirm('Are you sure you want to delete this patient?')) return;

  await fetch(`http://localhost:5000/patients/${id}`, {
    method: "DELETE"
  });

  loadPatients();
}

// Filter patients
function filterPatients() {
  const q = document.getElementById('patient-search').value.toLowerCase();

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.disease.toLowerCase().includes(q)
  );

  renderPatients(filtered);
}

// Load on page start
window.onload = function () {
  loadPatients();
};

// ---------- Doctors ----------
let doctors = [
  { id: 1, name: 'Dr. Rajesh Mehta',  spec: 'Cardiologist',    contact: '9876541230', email: 'mehta@hospital.com',  exp: 12, status: 'Available'   },
  { id: 2, name: 'Dr. Anita Singh',   spec: 'Neurologist',     contact: '9123456789', email: 'singh@hospital.com',  exp: 8,  status: 'Available'   },
  { id: 3, name: 'Dr. Suresh Reddy',  spec: 'Orthopedic',      contact: '9988001122', email: 'reddy@hospital.com',  exp: 15, status: 'On Leave'    },
  { id: 4, name: 'Dr. Pooja Verma',   spec: 'Dermatologist',   contact: '9871234560', email: 'verma@hospital.com',  exp: 6,  status: 'Available'   },
];
let nextDoctorId = 5;

function statusBadge(status) {
  if (status === 'Available')   return `<span class="badge green">${status}</span>`;
  if (status === 'On Leave')    return `<span class="badge amber">${status}</span>`;
  if (status === 'Unavailable') return `<span class="badge red">${status}</span>`;
  return status;
}

function renderDoctors(list) {
  const tbody = document.getElementById('doctor-table-body');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#aaa; padding:2rem;">No doctors found.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${d.name}</td>
      <td>${d.spec}</td>
      <td>${d.contact}</td>
      <td>${d.email}</td>
      <td>${statusBadge(d.status)}</td>
      <td><button class="btn-danger" onclick="deleteDoctor(${d.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addDoctor() {
  const name    = document.getElementById('d-name').value.trim();
  const spec    = document.getElementById('d-spec').value.trim();
  const contact = document.getElementById('d-contact').value.trim();
  const email   = document.getElementById('d-email').value.trim();
  const exp     = document.getElementById('d-exp').value.trim();
  const status  = document.getElementById('d-status').value;

  if (!name || !spec || !contact || !email || !exp || !status) {
    alert('Please fill in all fields.');
    return;
  }

  doctors.push({ id: nextDoctorId++, name, spec, contact, email, exp, status });
  renderDoctors(doctors);
  closeModal('doctor-modal');

  // Clear form
  ['d-name','d-spec','d-contact','d-email','d-exp'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('d-status').value = '';
}

function deleteDoctor(id) {
  if (!confirm('Are you sure you want to delete this doctor?')) return;
  doctors = doctors.filter(d => d.id !== id);
  renderDoctors(doctors);
}

function filterDoctors() {
  const q = document.getElementById('doctor-search').value.toLowerCase();
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q)
  );
  renderDoctors(filtered);
}

// Render on page load
renderDoctors(doctors);

// ================= APPOINTMENTS =================

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

function addAppointment() {
  const patient = document.getElementById("a-patient").value;
  const doctor = document.getElementById("a-doctor").value;
  const date = document.getElementById("a-date").value;
  const time = document.getElementById("a-time").value;
  const status = document.getElementById("a-status").value;

  if (!patient || !doctor || !date || !time) {
    alert("Please fill all fields");
    return;
  }

  const newAppointment = { patient, doctor, date, time, status };
  appointments.push(newAppointment);

  localStorage.setItem("appointments", JSON.stringify(appointments));

  closeModal("appointment-modal");
  renderAppointments();
}

function renderAppointments() {
  const table = document.getElementById("appointment-table-body");
  table.innerHTML = "";

  appointments.forEach((a, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${a.patient}</td>
        <td>${a.doctor}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="badge">${a.status}</span></td>
        <td><button onclick="deleteAppointment(${index})" style="color:red;">Delete</button></td>
      </tr>
    `;
  });
}

function deleteAppointment(index) {
  appointments.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
}

// ================= BILLING =================

let bills = JSON.parse(localStorage.getItem("bills")) || [];

function addBill() {
  const patient = document.getElementById("b-patient").value;
  const fee = parseFloat(document.getElementById("b-fee").value) || 0;
  const medicine = parseFloat(document.getElementById("b-medicine").value) || 0;
  const other = parseFloat(document.getElementById("b-other").value) || 0;

  if (!patient) {
    alert("Enter patient name");
    return;
  }

  const total = fee + medicine + other;

  const newBill = { patient, fee, medicine, other, total };
  bills.push(newBill);

  localStorage.setItem("bills", JSON.stringify(bills));

  closeModal("billing-modal");
  renderBills();
}

function renderBills() {
  const table = document.getElementById("billing-table-body");
  table.innerHTML = "";

  bills.forEach((b, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${b.patient}</td>
        <td>₹${b.fee}</td>
        <td>₹${b.medicine}</td>
        <td>₹${b.other}</td>
        <td><b>₹${b.total}</b></td>
        <td><button onclick="deleteBill(${index})" style="color:red;">Delete</button></td>
      </tr>
    `;
  });
}

function deleteBill(index) {
  bills.splice(index, 1);
  localStorage.setItem("bills", JSON.stringify(bills));
  renderBills();
}

// ================= MEDICAL RECORDS =================

let records = JSON.parse(localStorage.getItem("records")) || [];

function addRecord() {
  const patient = document.getElementById("r-patient").value;
  const diagnosis = document.getElementById("r-diagnosis").value;
  const treatment = document.getElementById("r-treatment").value;
  const date = document.getElementById("r-date").value;

  if (!patient || !diagnosis || !treatment || !date) {
    alert("Please fill all fields");
    return;
  }

  const newRecord = { patient, diagnosis, treatment, date };
  records.push(newRecord);

  localStorage.setItem("records", JSON.stringify(records));

  closeModal("record-modal");
  renderRecords();
}

function renderRecords() {
  const table = document.getElementById("record-table-body");
  table.innerHTML = "";

  records.forEach((r, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${r.patient}</td>
        <td>${r.diagnosis}</td>
        <td>${r.treatment}</td>
        <td>${r.date}</td>
        <td><button onclick="deleteRecord(${index})" style="color:red;">Delete</button></td>
      </tr>
    `;
  });
}

function deleteRecord(index) {
  records.splice(index, 1);
  localStorage.setItem("records", JSON.stringify(records));
  renderRecords();
}