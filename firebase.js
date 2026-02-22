// ===============================
// FIREBASE IMPORTS
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyCIp5L7qkWlpxbh8XoinLLMelTAF9jTR3I",
  authDomain: "break4th-f605d.firebaseapp.com",
  projectId: "break4th-f605d",
  storageBucket: "break4th-f605d.firebasestorage.app",
  messagingSenderId: "95557162634",
  appId: "1:95557162634:web:806d66801f200e84813f73"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// REGISTER DOCTOR
// ===============================

window.registerDoctor = async function () {

  const name = document.getElementById("doctorName")?.value;
  const hospital = document.getElementById("hospitalName")?.value;
  const license = document.getElementById("licenseNumber")?.value;
  const email = document.getElementById("doctorEmail")?.value;
  const password = document.getElementById("doctorPassword")?.value;

  if (!name || !hospital || !license || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "doctors", userCredential.user.uid), {
      name,
      hospital,
      license,
      email,
      createdAt: new Date()
    });

    // Go to dashboard immediately
    window.location.href = "doctordashboard.html";

  } catch (error) {
    alert(error.message);
  }
};


// ===============================
// LOGIN DOCTOR
// ===============================

window.loginDoctor = async function () {

  const email = document.getElementById("doctorEmail")?.value;
  const password = document.getElementById("doctorPassword")?.value;

  if (!email || !password) {
    alert("Enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "doctordashboard.html";
  } catch (error) {
    alert(error.message);
  }
};


// ===============================
// LOGOUT
// ===============================

window.logout = async function () {
  await signOut(auth);
  window.location.href = "doctor-login.html";
};


// ===============================
// PROTECT DASHBOARD ONLY
// ===============================

onAuthStateChanged(auth, (user) => {

  const path = window.location.pathname;

  // Protect ONLY dashboard
  if (path.includes("doctordashboard.html") && !user) {
    window.location.href = "doctor-login.html";
  }

});