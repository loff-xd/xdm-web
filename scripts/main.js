// --- IMPORTS ---
import { readManifestText } from "./dataManager.js";
import { createPDF } from "./pdf.js";

// --- GLOBALS ---
var submitButton;
var createButton;
var saveButton;
var manifestPasteForm;
export var manifest = {
    manifestID: "",
    ssccs: [],
};
var ssccList;

// --- EVENTS ---
window.addEventListener("load", function () {
    // CALL ON FULL PAGE LOAD
    manifestPasteForm = document.getElementById("manifest_paste");
    document.getElementById("clear_button").addEventListener("click", onClear, false);

    submitButton = document.getElementById("submit_button");
    submitButton.addEventListener("click", onSubmit, false);

    createButton = document.getElementById("create_button");
    createButton.addEventListener("click", onCreatePDF, false);

    ssccList = document.getElementById("sscc_list");

    document.getElementById("preload").style.opacity = 0;
    document.getElementById("preload").style.visibility = "hidden";

    saveButton = document.getElementById("save_button");
    saveButton.addEventListener("click", doUpload, false);
});

// --- FUNCTIONS ---
// CLEAR BUTTON
function doUpload() {
    let rt;
    let content = JSON.stringify(manifest);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            rt = this.responseText;
            alert(rt);
        }
    };

    xmlhttp.open("POST", "fileHandler.php?id=" + manifest.manifestID, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(content);
    console.log(JSON.stringify(manifest).length);
}

function onClear() {
    if (window.confirm("Do you wish to also erase all store manifests from the server?")) {
        let rt;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                rt = this.responseText;
                alert(rt);
            }
        };
        xmlhttp.open("GET", "fileHandler.php?del=1", true);
        xmlhttp.send();
    }
    manifestPasteForm.value = "";
    ssccList.innerHTML = "";
    document.getElementById("sscc_list_container").classList.add("collapsed");
    document.getElementById("manifest_paste_container").classList.remove("collapsed");
}

function toggleHighRisk() {
    let targetSSCC = manifest.ssccs.find((element) => element.sscc == this.id);
    if (targetSSCC.highRisk === true) {
        this.classList.remove("selected");
        targetSSCC.highRisk = false;
    } else {
        this.classList.add("selected");
        targetSSCC.highRisk = true;
    }
}

// SUBMIT BUTTON
function onSubmit() {
    submitButton.disabled = true;

    // GENERATE LIST IF SUCCESSFULLY READ 
    if (readManifestText(manifestPasteForm.value)) {
        //createPDF(manifest, reduced);

        manifest.ssccs.forEach(entry => {
            let li = document.createElement("div");
            li.classList.add("sscc_list_item");
            li.innerText = entry.lastFour;
            li.id = entry.sscc;
            li.addEventListener('click', toggleHighRisk, false);
            ssccList.appendChild(li);
        });
        document.getElementById("sscc_list_container").classList.remove("collapsed");
        document.getElementById("manifest_paste_container").classList.add("collapsed");

    }
    submitButton.disabled = false;
}

// CREATE PDF BUTTON
function onCreatePDF() {
    createButton.disabled = true;

    var reduced = document.getElementById("option_reduced").checked;
    createPDF(manifest, reduced);

    createButton.disabled = false;
}
