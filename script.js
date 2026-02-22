/* =========================================
   DEMO DATA INITIALIZATION
========================================= */

function initializeDemoData() {

    if (!localStorage.getItem("submissions")) {
        localStorage.setItem("submissions", JSON.stringify([
            {
                name: "John Matthews",
                summary: "Chest pain and shortness of breath for 2 days",
                date: "2026-02-20 09:15 AM"
            }
        ]));
    }

    if (!localStorage.getItem("appointments")) {
        localStorage.setItem("appointments", JSON.stringify([]));
    }
}

/* =========================================
   RISK ENGINE (ONLY ONE VERSION)
========================================= */

function detectRisk(text) {

    text = text.toLowerCase();
    let possible = [];

    if (text.includes("chest pain") || text.includes("shortness of breath")) {
        possible.push("Acute Coronary Syndrome", "Angina");
        return { level: "HIGH RISK - Possible Cardiac Emergency", color: "red", category: possible };
    }

    if (text.includes("fever") || text.includes("cough")) {
        possible.push("Influenza", "Respiratory Infection");
        return { level: "MODERATE RISK - Possible Infection", color: "orange", category: possible };
    }

    possible.push("General Medical Evaluation Required");
    return { level: "LOW RISK - Routine Consultation", color: "green", category: possible };
}

/* =========================================
   PATIENT LOGIN SYSTEM
========================================= */

function patientLogin() {

    const username = document.getElementById("patientUsername")?.value;
    const password = document.getElementById("patientPassword")?.value;

    if (username === "john123" && password === "patient123") {
        localStorage.setItem("patientLoggedIn", "true");
        window.location.href = "patientdashboard.html";
    } else {
        alert("Invalid credentials.\nUsername: john123\nPassword: patient123");
    }
}

function checkPatientAccess() {
    if (localStorage.getItem("patientLoggedIn") !== "true") {
        window.location.href = "patient-login.html";
    }
}

function patientLogout() {
    localStorage.removeItem("patientLoggedIn");
    window.location.href = "index.html";
}

/* =========================================
   PATIENT VOICE SYSTEM
========================================= */

let patientRecognition;

function setPatientMode(mode) {

    const typeBtn = document.getElementById("patientTypeBtn");
    const voiceBtn = document.getElementById("patientVoiceBtn");
    const status = document.getElementById("patientVoiceStatus");

    typeBtn.classList.remove("active");
    voiceBtn.classList.remove("active");

    if (mode === "type") {
        typeBtn.classList.add("active");
        if (patientRecognition) patientRecognition.stop();
        status.classList.add("hidden");
    } else {
        voiceBtn.classList.add("active");
        startPatientVoice();
    }
}

function startPatientVoice() {

    const input = document.getElementById("patientInput");
    const status = document.getElementById("patientVoiceStatus");

    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Voice recognition not supported.");
        return;
    }

    patientRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    patientRecognition.lang = "en-US";
    patientRecognition.start();

    status.classList.remove("hidden");

    patientRecognition.onresult = function (event) {
        input.value = event.results[0][0].transcript;
        status.classList.add("hidden");
    };

    patientRecognition.onerror = function () {
        status.classList.add("hidden");
        alert("Voice recognition error.");
    };
}

/* =========================================
   PATIENT ANALYSIS
========================================= */

function analyzePatient() {

    const input = document.getElementById("patientInput").value.trim();
    const summaryBox = document.getElementById("summary");
    const riskBox = document.getElementById("patientRisk");
    const output = document.getElementById("patientOutput");

    if (!input) {
        alert("Please describe symptoms.");
        return;
    }

    const risk = detectRisk(input);

    summaryBox.innerHTML = `
        <strong>Patient Report:</strong><br><br>
        ${input}<br><br>
        <strong>Assessment:</strong><br>
        ${risk.category.join(", ")}
    `;

    riskBox.innerText = risk.level;

    if (risk.color === "red") riskBox.style.background = "#7f1d1d";
    else if (risk.color === "orange") riskBox.style.background = "#7c2d12";
    else riskBox.style.background = "#14532d";

    output.classList.remove("hidden");
}

/* =========================================
   SEND TO DOCTOR
========================================= */

function sendToDoctorFromPatient() {

    const summary = document.getElementById("summary").innerText;

    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];

    submissions.push({
        name: "Live Patient",
        summary: summary,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("submissions", JSON.stringify(submissions));

    alert("Summary sent to Doctor!");
}

/* =========================================
   APPOINTMENT SYSTEM
========================================= */

function bookAppointment() {

    const date = document.getElementById("appointmentDate").value;
    const type = document.getElementById("appointmentType").value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        name: "Live Patient",
        date,
        type,
        status: "Pending"
    });

    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment requested.");
}

/* =========================================
   PHARMACY DELIVERY SYSTEM
========================================= */

function requestMedication() {

    const medication = document.getElementById("medicationSelect").value;
    const box = document.getElementById("deliveryStatus");

    box.classList.remove("hidden");
    box.innerHTML = `<strong>${medication}</strong><br>Status: Preparing...`;

    setTimeout(() => {
        box.innerHTML = `<strong>${medication}</strong><br>Status: Out for Delivery 🚚`;
    }, 3000);

    setTimeout(() => {
        box.innerHTML = `<strong>${medication}</strong><br>Status: Delivered ✅`;
    }, 6000);
}

/* =========================================
   PDF EXPORT
========================================= */

async function downloadPatientPDF() {

    if (!window.jspdf) {
        alert("PDF library not loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("ClinAssist AI - Patient Summary", 20, 20);
    doc.text(document.getElementById("summary").innerText, 20, 40);

    doc.save("Patient_Summary.pdf");
}

/* =========================================
   AUTO LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeDemoData();
});