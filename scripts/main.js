// --- IMPORTS ---
import { readManifestText } from "./dataManager.js";
import { create_pdf } from "./pdf.js";

// --- GLOBALS ---

var submitButton;
let manifest_paste_form;
export var manifest = [];

// --- EVENTS ---
window.addEventListener('load', function() { // CALL ON FULL PAGE LOAD
    manifest_paste_form = document.getElementById("manifest_paste");
    document.getElementById("clearButton").addEventListener("click", onClear, false);
    submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", onSubmit, false);

    document.getElementById("preload").style.opacity = 0;
    document.getElementById("preload").style.visibility = "hidden";
});

// --- FUNCTIONS ---
// CLEAR BUTTON
function onClear() {
    manifest_paste_form.value = '';
};


// SUBMIT BUTTON
function onSubmit() {
    submitButton.innerHTML = "...";  // SHOW GENERATION START
    submitButton.disabled = true;

    var reduced = document.getElementById("optionReduced").checked;
    if (readManifestText(manifest_paste_form.value)) {create_pdf(manifest, reduced);};

    submitButton.innerHTML = "SUBMIT";
    submitButton.disabled = false;
};