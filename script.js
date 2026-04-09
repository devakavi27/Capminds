let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let editId = null;

const modal = document.getElementById("modal");

document.getElementById("openModal").onclick = () => {
  modal.style.display = "block";
};

function closeModal() {
  modal.style.display = "none";
  clearForm();
}

function clearForm() {
  document.querySelectorAll(".modal input, textarea").forEach(e => e.value = "");
  editId = null;
}

function saveAppointment() {
  let patient = patientInput.value;
  let doctor = doctorInput.value;
  let hospital = hospitalInput.value;
  let specialty = specialtyInput.value;
  let date = dateInput.value;
  let time = timeInput.value;

  if (!patient || !doctor || !date || !time) {
    alert("Fill required fields");
    return;
  }

  if (editId) {
    appointments = appointments.map(a =>
      a.id === editId ? { ...a, patient, doctor, hospital, specialty, date, time } : a
    );
  } else {
    appointments.push({
      id: Date.now(),
      patient,
      doctor,
      hospital,
      specialty,
      date,
      time
    });
  }

  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
  renderCalendar();
  closeModal();
}

function renderAppointments(data = appointments) {
  let list = document.getElementById("appointmentList");
  list.innerHTML = "";

  data.forEach(a => {
    list.innerHTML += `
      <tr>
        <td>${a.patient}</td>
        <td>${a.doctor}</td>
        <td>${a.hospital}</td>
        <td>${a.specialty}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>
          <span class="edit" onclick="editApp(${a.id})">✏️</span>
          <span class="delete" onclick="deleteApp(${a.id})">🗑️</span>
        </td>
      </tr>
    `;
  });
}

function deleteApp(id) {
  appointments = appointments.filter(a => a.id !== id);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
  renderCalendar();
}

function editApp(id) {
  let a = appointments.find(x => x.id === id);

  patientInput.value = a.patient;
  doctorInput.value = a.doctor;
  hospitalInput.value = a.hospital;
  specialtyInput.value = a.specialty;
  dateInput.value = a.date;
  timeInput.value = a.time;

  editId = id;
  modal.style.display = "block";
}

function renderCalendar() {
  let cal = document.getElementById("calendar");
  cal.innerHTML = "";

  for (let i = 1; i <= 30; i++) {
    let div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<b>${i}</b>`;

    appointments.forEach(a => {
      if (new Date(a.date).getDate() === i) {
        let ev = document.createElement("div");
        ev.className = "event";
        ev.innerText = a.patient + " (" + a.time + ")";
        div.appendChild(ev);
      }
    });

    cal.appendChild(div);
  }
}

function applyFilters() {
  let p = searchPatient.value.toLowerCase();
  let d = searchDoctor.value.toLowerCase();
  let from = fromDate.value;
  let to = toDate.value;

  let filtered = appointments.filter(a => {
    return (
      a.patient.toLowerCase().includes(p) &&
      a.doctor.toLowerCase().includes(d) &&
      (!from || a.date >= from) &&
      (!to || a.date <= to)
    );
  });

  renderAppointments(filtered);
}

/* Init */
const patientInput = document.getElementById("patient");
const doctorInput = document.getElementById("doctor");
const hospitalInput = document.getElementById("hospital");
const specialtyInput = document.getElementById("specialty");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

renderAppointments();
renderCalendar();
let currentMonth = 0;
let currentYear = 2026;

function updateMonthYear() {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  document.getElementById("monthYear").innerText =
    months[currentMonth] + " " + currentYear;
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateMonthYear();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateMonthYear();
}

function goToday() {
  let today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  updateMonthYear();
}

/* INIT */
updateMonthYear();
