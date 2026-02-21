
/* ===============================
   DEMO DATA INITIALIZATION
================================ */

function initializeDemoData() {

    // Demo Patient Submissions
    if (!localStorage.getItem("submissions")) {
        const demoSubmissions = [
            {
                name: "John Matthews",
                summary: "Chest pain and shortness of breath for 2 days",
                date: "2026-02-20 09:15 AM"
            },
            {
                name: "Sarah Johnson",
                summary: "High fever and persistent cough for 3 days",
                date: "2026-02-20 11:40 AM"
            },
            {
                name: "Peter Williams",
                summary: "Severe headache and dizziness since morning",
                date: "2026-02-21 08:10 AM"
            }
        ];

        localStorage.setItem("submissions",
            JSON.stringify(demoSubmissions));
    }

    // Demo Appointments
    if (!localStorage.getItem("appointments")) {
        const demoAppointments = [
            {
                name: "John Matthews",
                date: "2026-02-25",
                type: "Online Consultation",
                status: "Pending"
            },
            {
                name: "Sarah Johnson",
                date: "2026-02-26",
                type: "Physical Visit",
                status: "Approved"
            },
            {
                name: "Peter Williams",
                date: "2026-02-27",
                type: "Online Consultation",
                status: "Pending"
            }
        ];

        localStorage.setItem("appointments",
            JSON.stringify(demoAppointments));
    }
}

/* ===============================
   VOICE RECOGNITION
================================ */

let recognition;

function setMode(mode) {
    document.getElementById("typeModeBtn").classList.remove("active");
    document.getElementById("voiceModeBtn").classList.remove("active");

    if (mode === "type") {
        document.getElementById("typeModeBtn").classList.add("active");
        if (recognition) recognition.stop();
    } else {
        document.getElementById("voiceModeBtn").classList.add("active");
        startVoiceRecognition();
    }
}

function startVoiceRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById("doctorInput").value =
            event.results[0][0].transcript;
    };
}

/* ===============================
   RISK & DIAGNOSIS ENGINE
================================ */

function detectRisk(text) {
    text = text.toLowerCase();

    let possible = [];

    if (text.includes("chest pain") || text.includes("shortness of breath")) {
        possible.push("Acute Coronary Syndrome");
        possible.push("Angina");
        return { level: "HIGH RISK - Possible Cardiac Emergency",
                 color: "red",
                 category: possible };
    }

    if (text.includes("fever") || text.includes("cough")) {
        possible.push("Influenza");
        possible.push("Respiratory Infection");
        possible.push("COVID-like Viral Illness");
        return { level: "MODERATE RISK - Possible Infectious Condition",
                 color: "orange",
                 category: possible };
    }

    possible.push("General Medical Evaluation Required");
    return { level: "LOW RISK - Routine Consultation",
             color: "green",
             category: possible };
}

/* ===============================
   DOCTOR ANALYSIS
================================ */

function analyzeDoctor() {
    const input = document.getElementById("doctorInput").value;
    const risk = detectRisk(input);

    const soapText = `
SUBJECTIVE:
Patient reports: ${input}

OBJECTIVE:
Vital signs pending. Clinical examination required.

ASSESSMENT:
Based on reported symptoms, potential considerations include:
- ${risk.category.join("\n- ")}

PLAN:
• Order relevant diagnostic tests.
• Monitor vital parameters.
• Consider specialist referral if symptoms worsen.
`;

    document.getElementById("soap").innerText = soapText;
    document.getElementById("diagnosis").innerText =
        risk.category.join(", ");

    const riskBox = document.getElementById("risk");
    riskBox.innerText = risk.level;

    if (risk.color === "red") riskBox.style.background = "#7f1d1d";
    else if (risk.color === "orange") riskBox.style.background = "#7c2d12";
    else riskBox.style.background = "#14532d";

    document.getElementById("doctorOutput").classList.remove("hidden");
}

/* ===============================
   LOGIN SYSTEM
================================ */

function doctorLogin() {
    if (doctorUsername.value === "drsmith" &&
        doctorPassword.value === "doc123") {
        localStorage.setItem("role", "doctor");
        window.location.href = "doctordashboard.html";
    } else {
        doctorError.innerText = "Invalid credentials.";
    }
}

function patientLogin() {
    if (patientUsername.value === "john123" &&
        patientPassword.value === "patient123") {
        localStorage.setItem("role", "patient");
        window.location.href = "patientdashboard.html";
    } else {
        patientError.innerText = "Invalid credentials.";
    }
}

function checkAccess(role) {
    if (localStorage.getItem("role") !== role) {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

/* ===============================
   APPOINTMENT SYSTEM
================================ */

function bookAppointment() {

    const date =
        document.getElementById("appointmentDate").value;

    const type =
        document.getElementById("appointmentType").value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        name: "Live Patient",
        date: date,
        type: type,
        status: "Pending"
    });

    localStorage.setItem("appointments",
        JSON.stringify(appointments));

    alert("Appointment request sent to doctor.");
}
function loadDoctorActivity() {

    const submissions =
        JSON.parse(localStorage.getItem("submissions")) || [];

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const submissionContainer =
        document.getElementById("patientSubmissions");

    const appointmentContainer =
        document.getElementById("appointments");

    // LOAD SUBMISSIONS
    // LOAD SUBMISSIONS WITH RISK SORTING
if (submissionContainer) {

    if (submissions.length === 0) {
        submissionContainer.innerHTML =
            "<p>No patient submissions yet.</p>";
    } else {

        // Attach risk to each submission dynamically
        const enhancedSubmissions = submissions.map(s => {
            const riskData = detectRisk(s.summary);

            let priorityValue = 1;
            let priorityClass = "priority-low";
            let badgeClass = "risk-low";
            let label = "LOW";

            if (riskData.color === "red") {
                priorityValue = 3;
                priorityClass = "priority-high";
                badgeClass = "risk-high";
                label = "HIGH";
            } else if (riskData.color === "orange") {
                priorityValue = 2;
                priorityClass = "priority-moderate";
                badgeClass = "risk-moderate";
                label = "MODERATE";
            }

            return {
                ...s,
                priorityValue,
                priorityClass,
                badgeClass,
                label
            };
        });

        // Sort High → Moderate → Low
        enhancedSubmissions.sort((a, b) =>
            b.priorityValue - a.priorityValue
        );

        submissionContainer.innerHTML =
            enhancedSubmissions.map(s => `
                <div class="appointment-card ${s.priorityClass}">
                    <strong>${s.name}</strong><br>
                    Symptoms: ${s.summary}<br>
                    <small>${s.date}</small><br>
                    <span class="risk-badge ${s.badgeClass}">
                        ${s.label} RISK
                    </span>
                </div>
            `).join("");
    }
}

    // LOAD APPOINTMENTS
    if (appointmentContainer) {
        if (appointments.length === 0) {
            appointmentContainer.innerHTML =
                "<p>No appointment requests.</p>";
        } else {
            appointmentContainer.innerHTML =
                appointments.map((a, index) => `
                    <div class="appointment-card">
                        <strong>${a.name}</strong><br>
                        ${a.type}<br>
                        Date: ${a.date}<br>
                        Status: <span class="status-${a.status.toLowerCase()}">${a.status}</span><br>
                        <div class="appt-buttons">
                            <button onclick="approveAppointment(${index})">
                                Approve
                            </button>
                            <button onclick="rescheduleAppointment(${index})">
                                Reschedule
                            </button>
                        </div>
                    </div>
                `).join("");
        }
    }
}
function approveAppointment(index) {
    const appointments =
        JSON.parse(localStorage.getItem("appointments"));
    appointments[index].status = "Approved";
    localStorage.setItem("appointments",
        JSON.stringify(appointments));
    loadDoctorActivity();
}

function rescheduleAppointment(index) {
    const newDate = prompt("Enter new date:");
    if (!newDate) return;

    const appointments =
        JSON.parse(localStorage.getItem("appointments"));
    appointments[index].date = newDate;
    appointments[index].status = "Rescheduled";
    localStorage.setItem("appointments",
        JSON.stringify(appointments));
    loadDoctorActivity();
}

/* ===============================
   PDF EXPORT
================================ */

async function downloadDoctorPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("ClinAssist AI - Clinical Report", 20, 20);
    doc.text(document.getElementById("soap").innerText, 20, 35);
    doc.save("Doctor_Report.pdf");
}


initializeDemoData();

/* ===============================
   PATIENT ANALYSIS
================================ */

function analyzePatient() {

    const input =
        document.getElementById("patientInput").value.trim();

    const outputSection =
        document.getElementById("patientOutput");

    const summaryBox =
        document.getElementById("summary");

    const riskBox =
        document.getElementById("patientRisk");

    if (input.length < 15) {
        summaryBox.innerHTML = `
        <strong>More Information Needed:</strong>
        <ul>
          <li>How long have you had symptoms?</li>
          <li>Where is the discomfort located?</li>
          <li>Severity (1–10)?</li>
          <li>Any fever, nausea, dizziness?</li>
        </ul>
        `;
        riskBox.innerText =
          "Insufficient data for risk assessment";
        riskBox.style.background = "#334155";
        outputSection.classList.remove("hidden");
        return;
    }

    const risk = detectRisk(input);

    summaryBox.innerHTML = `
    <strong>Patient Report:</strong><br>
    ${input}<br><br>
    <strong>Preliminary Assessment:</strong><br>
    ${risk.category.join(", ")}
    `;

    riskBox.innerText = risk.level;

    if (risk.color === "red")
        riskBox.style.background = "#7f1d1d";
    else if (risk.color === "orange")
        riskBox.style.background = "#7c2d12";
    else
        riskBox.style.background = "#14532d";

    outputSection.classList.remove("hidden");
}
/* ===============================
   SEND TO DOCTOR
================================ */

function sendToDoctorFromPatient() {

    const summary =
        document.getElementById("summary").innerText;

    const submissions =
        JSON.parse(localStorage.getItem("submissions")) || [];

    submissions.push({
        name: "Live Patient",
        summary: summary,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("submissions",
        JSON.stringify(submissions));

    alert("Summary sent to Doctor!");
}

/* ===============================
   PHARMACY DELIVERY SYSTEM
================================ */

function requestMedication() {

    const medication =
        document.getElementById("medicationSelect").value;

    const deliveryBox =
        document.getElementById("deliveryStatus");

    deliveryBox.classList.remove("hidden");

    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + 30);

    deliveryBox.innerHTML = `
        <strong>${medication}</strong><br>
        Status: Preparing Order...
    `;

    setTimeout(() => {
        deliveryBox.innerHTML = `
            <strong>${medication}</strong><br>
            Status: Out for Delivery 🚚
        `;
    }, 3000);

    setTimeout(() => {
        deliveryBox.innerHTML = `
            <strong>${medication}</strong><br>
            Status: Delivered ✅<br>
            Arrival Time: ${arrivalTime.toLocaleTimeString()}
        `;
    }, 6000);
}
/* ===============================
   PDF EXPORT
================================ */

async function downloadPatientPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("ClinAssist AI - Patient Summary", 20, 20);
    doc.text(document.getElementById("summary").innerText, 20, 40);
    doc.save("Patient_Summary.pdf");
}

/* ===============================
   PATIENT VOICE SYSTEM
================================ */

let patientRecognition;

function setPatientMode(mode) {

    document.getElementById("patientTypeBtn")
        .classList.remove("active");
    document.getElementById("patientVoiceBtn")
        .classList.remove("active");

    if (mode === "type") {
        document.getElementById("patientTypeBtn")
            .classList.add("active");
        if (patientRecognition) patientRecognition.stop();
        document.getElementById("patientVoiceStatus")
            .classList.add("hidden");
    } else {
        document.getElementById("patientVoiceBtn")
            .classList.add("active");
        startPatientVoice();
    }
}

function startPatientVoice() {

    const status =
        document.getElementById("patientVoiceStatus");

    status.classList.remove("hidden");

    patientRecognition =
        new (window.SpeechRecognition ||
             window.webkitSpeechRecognition)();

    patientRecognition.lang = "en-US";
    patientRecognition.start();

    patientRecognition.onresult = function(event) {
        document.getElementById("patientInput").value =
            event.results[0][0].transcript;
        status.classList.add("hidden");
    };

    patientRecognition.onerror = function() {
        status.classList.add("hidden");
        alert("Voice recognition error.");
    };
}