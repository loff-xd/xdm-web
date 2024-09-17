// --- IMPORTS ---
import { compareBySSCC } from "./helpers.js";
import { manifest } from "./main.js";
import { buttonFeedback } from "./page.js";

// --- FUNCTIONS ---
export function readManifestText(text) {
    // CONVERT TEXT INTO 2D ARRAY
    let manifestArray = text.split("\n"); // SPLIT LINES TO ARRAY
    if (manifestArray.length < 7) {
        // FAILED MANIFEST CHECK
        console.warn("Failed size check");
        buttonFeedback();
        return false;
    } else if (manifestArray[1].slice(0, 24) != "ZRSRPR_DELIVERY_MANIFEST") {
        // FAILED MANIFEST CHECK
        console.warn("Failed keyword check");
        buttonFeedback();
        return false;
    } else {
        for (let i = manifestArray.length - 1; i >= 0; i--) {
            if (
                manifestArray[i].charAt(0) != "|" ||
                manifestArray[i].charAt(1) == "*"
            ) {
                // REMOVE UNWANTED LINES
                manifestArray.remove(i);
            } else {
                // SPLIT AND TRIM EACH LINE TO CREATE 2D ARRAY

                manifestArray[i] = manifestArray[i].split("|"); // SPLIT INTO ELEMENTS
                for (let j = manifestArray[i].length - 1; j >= 0; j--) {
                    manifestArray[i][j] = manifestArray[i][j].trim(); // REMOVE EXCESS WHITESPACE
                }
                manifestArray[i].remove(11); // REMOVE UNWANTED ELEMENTS
                manifestArray[i].remove(10);
                manifestArray[i].remove(0);
            }
        }
        manifestArray.shift(); // REMOVE HEADERS FROM ARRAY

        manifest.mainfestID = manifestArray[0][0]; // SET MANIFEST ID

        for (let i = manifestArray.length - 1; i >= 0; i--) {
            let entry = new Object();
            entry.sscc = manifestArray[i][1];
            entry.lastFour = entry.sscc.slice(entry.sscc.length - 4);
            entry.sku = manifestArray[i][3];
            entry.desc = manifestArray[i][4];
            entry.gtin = manifestArray[i][6];
            entry.qty = manifestArray[i][7];
            manifest.ssccs.push(entry);
        }

        manifest.ssccs.sort(compareBySSCC); // SORT BY SSCC LASTFOUR
    }
    return true;
}
