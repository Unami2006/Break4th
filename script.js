
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
    const date = document.getElementById("appointmentDate").value;
    const type = document.getElementById("appointmentType").value;

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        date: date,
        type: type,
        status: "Pending"
    });

    localStorage.setItem("appointments",
        JSON.stringify(appointments));

    alert("Appointment Request Sent!");
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
    if (submissionContainer) {
        if (submissions.length === 0) {
            submissionContainer.innerHTML =
                "<p>No patient submissions yet.</p>";
        } else {
            submissionContainer.innerHTML =
                submissions.map(s => `
                    <div class="appointment-card">
                        <strong>${s.name}</strong><br>
                        Symptoms: ${s.summary}<br>
                        <small>${s.date}</small>
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