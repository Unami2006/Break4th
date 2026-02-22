/* =========================================
   PATIENT SIDE – CLEAN & WORKING VERSION
   (Does NOT affect doctor functionality)
========================================= */

/* ---------- PROTECT PATIENT DASHBOARD ---------- */

function checkAccess(role) {
    if (role === "patient") {
        if (localStorage.getItem("patientLoggedIn") !== "true") {
            window.location.href = "patient-login.html";
        }
    }
}

/* ---------- PATIENT LOGIN ---------- */

function patientLogin() {

    const username = document.getElementById("patientUsername")?.value;
    const password = document.getElementById("patientPassword")?.value;

    if (!username || !password) {
        alert("Enter username and password.");
        return;
    }

    if (username === "john123" && password === "patient123") {
        localStorage.setItem("patientLoggedIn", "true");
        window.location.href = "patientdashboard.html";
    } else {
        alert("Invalid credentials.\nUsername: john123\nPassword: patient123");
    }
}

/* ---------- PATIENT LOGOUT ---------- */

function patientLogout() {
    localStorage.removeItem("patientLoggedIn");
    window.location.href = "index.html";
}

/* ---------- PATIENT MODE TOGGLE ---------- */

let patientRecognition;

function setPatientMode(mode) {

    const typeBtn = document.getElementById("patientTypeBtn");
    const voiceBtn = document.getElementById("patientVoiceBtn");
    const status = document.getElementById("patientVoiceStatus");

    if (!typeBtn || !voiceBtn) return;

    typeBtn.classList.remove("active");
    voiceBtn.classList.remove("active");

    if (mode === "type") {
        typeBtn.classList.add("active");
        if (patientRecognition) patientRecognition.stop();
        if (status) status.classList.add("hidden");
    } else {
        voiceBtn.classList.add("active");
        startPatientVoice();
    }
}

/* ---------- PATIENT VOICE ---------- */

function startPatientVoice() {

    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Voice recognition not supported in this browser.");
        return;
    }

    const status = document.getElementById("patientVoiceStatus");
    const input = document.getElementById("patientInput");

    if (status) status.classList.remove("hidden");

    patientRecognition =
        new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    patientRecognition.lang = "en-US";
    patientRecognition.start();

    patientRecognition.onresult = function (event) {
        if (input) input.value = event.results[0][0].transcript;
        if (status) status.classList.add("hidden");
    };

    patientRecognition.onerror = function () {
        if (status) status.classList.add("hidden");
        alert("Voice recognition error.");
    };
}

/* ---------- PATIENT ANALYSIS ---------- */

function analyzePatient() {

    const input = document.getElementById("patientInput")?.value.trim();
    const outputSection = document.getElementById("patientOutput");
    const summaryBox = document.getElementById("summary");
    const riskBox = document.getElementById("patientRisk");

    if (!input) {
        alert("Please describe your symptoms first.");
        return;
    }

    if (input.length < 15) {

        summaryBox.innerHTML = `
            <strong>More Information Needed:</strong>
            <ul>
                <li>How long have symptoms lasted?</li>
                <li>Where is the pain located?</li>
                <li>Severity (1–10)?</li>
                <li>Any fever, dizziness, nausea?</li>
            </ul>
        `;

        riskBox.innerText = "Insufficient data for risk assessment";
        riskBox.style.background = "#334155";

        outputSection.classList.remove("hidden");
        return;
    }

    const risk = detectRisk(input);

    summaryBox.innerHTML = `
        <strong>Patient Report:</strong><br><br>
        ${input}<br><br>
        <strong>Preliminary Assessment:</strong><br>
        ${risk.category.join(", ")}
    `;

    riskBox.innerText = risk.level;

    if (risk.color === "red") riskBox.style.background = "#7f1d1d";
    else if (risk.color === "orange") riskBox.style.background = "#7c2d12";
    else riskBox.style.background = "#14532d";

    outputSection.classList.remove("hidden");
}

/* ---------- SEND TO DOCTOR ---------- */

function sendToDoctorFromPatient() {

    const summary = document.getElementById("summary")?.innerText;
    if (!summary) return;

    const submissions =
        JSON.parse(localStorage.getItem("submissions")) || [];

    submissions.push({
        name: "Live Patient",
        summary: summary,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("submissions", JSON.stringify(submissions));

    alert("Summary sent to Doctor!");
}

/* ---------- PATIENT PDF ---------- */

async function downloadPatientPDF() {

    if (!window.jspdf) {
        alert("PDF library not loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const text =
        document.getElementById("summary")?.innerText ||
        "No summary available.";

    doc.setFontSize(16);
    doc.text("ClinAssist AI - Patient Summary", 20, 20);

    doc.setFontSize(12);
    doc.text(text, 20, 40);

    doc.save("Patient_Summary.pdf");
}

/* ---------- APPOINTMENT (PATIENT SIDE) ---------- */

function bookAppointment() {

    const date = document.getElementById("appointmentDate")?.value;
    const type = document.getElementById("appointmentType")?.value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        name: "Live Patient",
        date,
        type,
        status: "Pending"
    });

    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment request sent.");
}

/* ---------- MEDICATION DELIVERY ---------- */

function requestMedication() {

    const medication =
        document.getElementById("medicationSelect")?.value;

    const deliveryBox =
        document.getElementById("deliveryStatus");

    if (!deliveryBox) return;

    deliveryBox.classList.remove("hidden");

    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 30);

    deliveryBox.innerHTML =
        `<strong>${medication}</strong><br>Status: Preparing Order...`;

    setTimeout(() => {
        deliveryBox.innerHTML =
            `<strong>${medication}</strong><br>Status: Out for Delivery 🚚`;
    }, 3000);

    setTimeout(() => {
        deliveryBox.innerHTML =
            `<strong>${medication}</strong><br>Status: Delivered ✅<br>
             Arrival Time: ${arrivalTime.toLocaleTimeString()}`;
    }, 6000);
}