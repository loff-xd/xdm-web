// DEFINITIONS (WAIT FOR LOAD BEFORE SETTING)

let manifest_paste_form;
var manifest = [];
var manifest_pdf;


window.addEventListener('DOMContentLoaded', function() {
    manifest_paste_form = document.getElementById("manifest_paste");
    document.getElementById("clearButton").addEventListener("click", onClear, false);
    document.getElementById("submitButton").addEventListener("click", onSubmit, false);
    this.document.getElementById("darkModeButton").addEventListener("click", darkModeToggle, false);
});

Array.prototype.remove = function(index) { // INCREASE READABILITY FOR ARRAYS
    this.splice(index, 1);
}

function compareBySSCC(a, b){
    if (a.lastFour < b.lastFour) return -1;
    if (a.lastFour > b.lastFour) return 1;
    return 0;
}

// CLEAR BUTTON
function onClear() {
    manifest_paste_form.value = '';
};


// SUBMIT BUTTON
function onSubmit() {
    // CONVERT TEXT INTO 2D ARRAY
    let manifest_array = manifest_paste_form.value.split('\n'); // SPLIT LINES TO ARRAY
    if (manifest_array.length < 7){
        // FAILED MANIFEST CHECK
        console.warn("failed size");
    }
    if (manifest_array[1].slice(0, 24) != "ZRSRPR_DELIVERY_MANIFEST") {
        // FAILED MANIFEST CHECK
        console.warn("failed keyword");
    }

    for (let i=manifest_array.length-1; i>=0; i--) {
        if ((manifest_array[i].charAt(0) != "|") || (manifest_array[i].charAt(1) == "*")) { // REMOVE UNWANTED LINES
            manifest_array.remove(i);
        } else {    // SPLIT AND TRIM EACH LINE TO CREATE 2D ARRAY
            
            manifest_array[i] = manifest_array[i].split("|"); // SPLIT INTO ELEMENTS
            for (let j=manifest_array[i].length-1; j>=0; j--) {
                manifest_array[i][j] = manifest_array[i][j].trim(); // REMOVE EXCESS WHITESPACE
            }
            manifest_array[i].remove(11); // REMOVE UNWANTED ELEMENTS
            manifest_array[i].remove(10);
            manifest_array[i].remove(0);
        }
    }
    manifest_array.shift(); // REMOVE HEADERS FROM ARRAY

    // OBJECTIFY
    for (let i=manifest_array.length-1; i>=0; i--) {
        let entry = new Object();
        entry.manifest = manifest_array[i][0];
        entry.sscc = manifest_array[i][1];
        entry.lastFour = entry.sscc.slice(entry.sscc.length - 4);
        entry.sku = manifest_array[i][3];
        entry.desc = manifest_array[i][4];
        entry.gtin = manifest_array[i][6];
        entry.qty = manifest_array[i][7];
        manifest.push(entry);
    }
    manifest.sort(compareBySSCC);   // SORT BY SSCC LASTFOUR

    console.log(manifest);           // TODO DEBUG

    create_pdf();
};


function onCreatePDF(){ // PDF CREATION CALLBACK
    // HIDE THROBBER + OPEN
    manifest_pdf.open();
}

function create_pdf() {

    //BUILD TABLE CONTENT
    var table_content = [["SSCC", "SKU", "DESC", "QTY"]];
    for (var i=0; i<manifest.length; i++){
        table_content.push([manifest[i].lastFour, manifest[i].sku, manifest[i].desc, manifest[i].qty]);
    }

    var header = "MANIFEST: " + manifest[0].manifest;
    // CREATE THE TABLE + PDF
    var document = {
        style: {font: 'courier'},
        content: [
            {text: header, style: {fontSize: 18, bold: true}},
            {
                style: {fontSize: 10},
                table: {
                    body: table_content
                }
            }
        ]
    }

    var win = window.open('waiting.html', '_blank');  // SHOW THROBBER
    //manifest_pdf = pdfMake.createPdf(document, onCreatePDF);
    pdfMake.createPdf(document).open({}, win);
    

}


//  DARK MODE TOGGLE

const root = document.documentElement
const theme = localStorage.getItem("theme");
if (theme !== null) {
    root.setAttribute("theme", theme);
} else {
    localStorage.setItem("theme", root.getAttribute("theme"));
}

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

//var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
//pdfMake.createPdf(docDefinition).open();