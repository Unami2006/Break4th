let isRegisterMode = false;

const title = document.getElementById("formTitle");
const extraFields = document.getElementById("extraFields");
const mainBtn = document.getElementById("mainBtn");
const switchText = document.getElementById("switchText");
const switchLink = document.getElementById("switchLink");

/* Force login mode on load */
extraFields.classList.add("hidden");
mainBtn.innerText = "Login";
mainBtn.onclick = loginDoctor;

/* Toggle between login and register */
switchLink.addEventListener("click", function(e) {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;

    if (isRegisterMode) {
        title.innerText = "Doctor Registration";
        extraFields.classList.remove("hidden");
        mainBtn.innerText = "Register";
        mainBtn.onclick = registerDoctor;
        switchText.innerText = "Already have an account?";
        switchLink.innerText = "Login";
    } else {
        title.innerText = "Doctor Login";
        extraFields.classList.add("hidden");
        mainBtn.innerText = "Login";
        mainBtn.onclick = loginDoctor;
        switchText.innerText = "Don't have an account?";
        switchLink.innerText = "Register";
    }
});