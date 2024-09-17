// --- IMPORTS ---
import { readManifestText } from "./dataManager.js";
import { createPDF } from "./pdf.js";

// --- GLOBALS ---

var submitButton;
var manifestPasteForm;
export var manifest = {
    manifestID: "",
    ssccs: [],
};

// --- EVENTS ---
window.addEventListener("load", function () {
    // CALL ON FULL PAGE LOAD
    manifestPasteForm = document.getElementById("manifest_paste");
    document
        .getElementById("clear_button")
        .addEventListener("click", onClear, false);
    submitButton = document.getElementById("submit_button");
    submitButton.addEventListener("click", onSubmit, false);

    document.getElementById("preload").style.opacity = 0;
    document.getElementById("preload").style.visibility = "hidden";
});

// --- FUNCTIONS ---
// CLEAR BUTTON
function onClear() {
    manifestPasteForm.value = "";
}

// SUBMIT BUTTON
function onSubmit() {
    submitButton.innerHTML = "..."; // SHOW GENERATION START
    submitButton.disabled = true;

    var reduced = document.getElementById("option_reduced").checked;
    if (readManifestText(manifestPasteForm.value)) {
        createPDF(manifest, reduced);
    }

    submitButton.innerHTML = "SUBMIT";
    submitButton.disabled = false;
}
