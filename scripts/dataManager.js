// --- IMPORTS ---
import { compareBySSCC } from "./helpers.js";
import { manifest } from "./main.js";
import { buttonFeedback } from "./page.js";

// --- FUNCTIONS ---
export function readManifestText(text){
// CONVERT TEXT INTO 2D ARRAY
    let manifest_array = text.split('\n'); // SPLIT LINES TO ARRAY
    if (manifest_array.length < 7){
        // FAILED MANIFEST CHECK
        console.warn("failed size check");
        buttonFeedback();
        return false;

    } else
    if (manifest_array[1].slice(0, 24) != "ZRSRPR_DELIVERY_MANIFEST") {
        // FAILED MANIFEST CHECK
        console.warn("failed keyword check");
        buttonFeedback();
        return false;

    } else {

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
    }
    return true;
}