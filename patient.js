// ================= SECTION SWITCH =================
function showPatientSection(section, el) {
  document.querySelectorAll(".doctor-section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById("psec-" + section).classList.add("active");

  document.querySelectorAll(".doctor-nav-item").forEach(item => {
    item.classList.remove("active");
  });

  el.classList.add("active");
}

// ================= LOAD APPOINTMENTS =================
function loadAppointments() {
  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  const table = document.getElementById("patient-appt-body");

  if (!table) return;

  table.innerHTML = "";

  data.forEach((a, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${a.doctor}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="badge ${a.status}">${a.status}</span></td>
      </tr>
    `;
  });
}

// ================= LOAD RECORDS =================
function loadRecords() {
  const data = JSON.parse(localStorage.getItem("records")) || [];
  const table = document.getElementById("patient-record-body");

  if (!table) return;

  table.innerHTML = "";

  data.forEach((r, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${r.diagnosis}</td>
        <td>${r.treatment}</td>
        <td>${r.date}</td>
      </tr>
    `;
  });
}

<td><span class="${a.status}">${a.status}</span></td>

// ================= INIT =================
window.onload = function () {
  loadAppointments();
  loadRecords();
};