// --- GLOBALS ---
const root = document.documentElement
const theme = localStorage.getItem("theme");

// --- INIT ---
if (theme !== null) {
    root.setAttribute("theme", theme);
} else {
    localStorage.setItem("theme", root.getAttribute("theme"));
}

window.addEventListener('DOMContentLoaded', function() { // HTML ONLY LOAD
    document.getElementById("darkModeButton").addEventListener("click", darkModeToggle, false);
    document.getElementById("helpButton").addEventListener("click", showHelp, false);
    document.getElementById("closeHelpButton").addEventListener("click", hideHelp, false);
    document.getElementById("closeWarningButton").addEventListener("click", hideWarning, false);
    document.getElementById("help_page").classList.add("collapsed");
});

// --- FUNCTIONS ---
function darkModeToggle() {
    var currentMode = root.getAttribute("theme");

    if (currentMode == "dark") {
        root.setAttribute("theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        root.setAttribute("theme", "dark");
        localStorage.setItem("theme", "dark");
    }
}

function showHelp(){
    document.getElementById("help_page").classList.remove("collapsed");
}

function hideHelp(){
    document.getElementById("help_page").classList.add("collapsed");
}

function hideWarning(){
    document.getElementById("dev_warning").style.opacity = 0;
    document.getElementById("dev_warning").style.visibility = "hidden";
}

export function buttonFeedback() {
    document.getElementById("submitButton").classList.add("shake");
    setTimeout(function() { document.getElementById("submitButton").classList.remove("shake"); }, 500);
}