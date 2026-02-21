function startVoice(id) {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById(id).value = event.results[0][0].transcript;
  };
}

function detectRisk(text) {
  text = text.toLowerCase();

  if (text.includes("chest pain") || text.includes("breathing")) {
    return { level: "High Risk", color: "red" };
  }
  if (text.includes("fever") || text.includes("cough")) {
    return { level: "Moderate Risk", color: "orange" };
  }
  return { level: "Low Risk", color: "green" };
}

function analyzeDoctor() {
  const input = document.getElementById("doctorInput").value;
  const risk = detectRisk(input);

  document.getElementById("soap").innerHTML = `
    <p><strong>S:</strong> ${input}</p>
    <p><strong>O:</strong> Observations pending.</p>
    <p><strong>A:</strong> Further evaluation required.</p>
    <p><strong>P:</strong> Monitor and order tests if needed.</p>
  `;

  document.getElementById("risk").innerHTML =
    `<span style="color:${risk.color}">${risk.level}</span>`;

  document.getElementById("doctorOutput").classList.remove("hidden");
}

function analyzePatient() {
  const input = document.getElementById("patientInput").value;
  const risk = detectRisk(input);

  document.getElementById("summary").innerHTML = input;
  document.getElementById("patientRisk").innerHTML =
    `<span style="color:${risk.color}">${risk.level}</span>`;

  document.getElementById("patientOutput").classList.remove("hidden");
}

function notify(message) {
  alert(message + " (Demo Mode)");
}
// Practice Accounts
const doctorAccount = {
    username: "drsmith",
    password: "doc123"
};

const patientAccount = {
    username: "john123",
    password: "patient123"
};

function doctorLogin() {
    const username = document.getElementById("doctorUsername").value;
    const password = document.getElementById("doctorPassword").value;

    if (username === doctorAccount.username && password === doctorAccount.password) {
        localStorage.setItem("role", "doctor");
        window.location.href = "doctordashboard.html";
    } else {
        document.getElementById("doctorError").innerText = "Invalid credentials.";
    }
}

function patientLogin() {
    const username = document.getElementById("patientUsername").value;
    const password = document.getElementById("patientPassword").value;

    if (username === patientAccount.username && password === patientAccount.password) {
        localStorage.setItem("role", "patient");
        window.location.href = "patientdashboard.html";
    } else {
        document.getElementById("patientError").innerText = "Invalid credentials.";
    }
}

// Protect Dashboard Pages
function checkAccess(roleRequired) {
    const role = localStorage.getItem("role");

    if (role !== roleRequired) {
        alert("Unauthorized access. Please login.");
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

/* ===============================
    PDF DOWNLOAD FUNCTIONS
================================ */

async function downloadDoctorPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const soapText = document.getElementById("soap").innerText;
    const riskText = document.getElementById("risk").innerText;

    doc.setFontSize(16);
    doc.text("ClinAssist AI - Doctor Report", 20, 20);

    doc.setFontSize(12);
    doc.text("SOAP Note:", 20, 35);
    doc.text(soapText, 20, 45);

    doc.text("Risk Level:", 20, 80);
    doc.text(riskText, 20, 90);

    doc.save("Doctor_Report.pdf");
}

async function downloadPatientPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const summary = document.getElementById("summary").innerText;
    const risk = document.getElementById("patientRisk").innerText;

    doc.setFontSize(16);
    doc.text("ClinAssist AI - Patient Summary", 20, 20);

    doc.setFontSize(12);
    doc.text("Symptom Summary:", 20, 35);
    doc.text(summary, 20, 45);

    doc.text("Risk Level:", 20, 80);
    doc.text(risk, 20, 90);

    doc.save("Patient_Summary.pdf");
}