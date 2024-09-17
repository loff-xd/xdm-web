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

        // BREAK DOWN RAW MANIFEST INTO ARTICLES
        let articles = [];

        for (let i = manifestArray.length - 1; i >= 0; i--) {
            let entry = new Object();
            entry.sscc = manifestArray[i][1];
            //entry.lastFour = entry.sscc.slice(entry.sscc.length - 4);
            entry.sku = manifestArray[i][3];
            entry.desc = manifestArray[i][4];
            entry.gtin = manifestArray[i][6];
            entry.qty = manifestArray[i][7];
            articles.push(entry);
        }

        // ITERATE THROUGH ARTICLE ARRAY TO ASSEMBLE SSCC LIST
        var ssccs = [];
        for (let i = 0; i < articles.length; i++) {

            // CREATE ARTICLE OBJECT
            let article = new Object();
            article.sku = articles[i].sku;
            article.gtin = articles[i].gtin;
            article.qty = articles[i].qty;
            article.desc = articles[i].desc;

            // DECIDE IF TO APPEND TO SSCC OR CREATE NEW
            if (i == 0) {
                let sscc = new Object();
                sscc.sscc = articles[i].sscc;
                sscc.lastFour = sscc.sscc.slice(sscc.sscc.length - 4);
                sscc.articles = [];
                sscc.highRisk = false;
                sscc.articles.push(article);
                ssccs.push(sscc);

            } else if (articles[i].sscc != ssccs[ssccs.length-1].sscc) {
                let sscc = new Object();
                sscc.sscc = articles[i].sscc;
                sscc.lastFour = sscc.sscc.slice(sscc.sscc.length - 4);
                sscc.articles = [];
                sscc.highRisk = false;
                sscc.articles.push(article);
                ssccs.push(sscc);

            } else {
                ssccs[ssccs.length-1].articles.push(article);
            }

        }

        manifest.manifestID = manifestArray[0][0]; // SET MANIFEST ID
        ssccs.sort(compareBySSCC); // SORT BY SSCC LASTFOUR
        manifest.ssccs = ssccs;
    }
    return true;
}
