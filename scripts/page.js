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