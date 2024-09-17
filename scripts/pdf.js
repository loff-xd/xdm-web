var manifestPDF;

export function createPDF(manifest, reduced) {
    //BUILD TABLE CONTENT

    var tableContent = [["SSCC", "SKU", "DESCRIPTION", "QTY", "CHK"]];
    for (let i = 0; i < manifest.ssccs.length; i++) {
        
        // FOR UNIQUE ARTICLES
        if (manifest.ssccs[i].articles.length == 1) {
            tableContent.push([
                manifest.ssccs[i].lastFour,
                manifest.ssccs[i].articles[0].sku,
                manifest.ssccs[i].articles[0].desc,
                manifest.ssccs[i].articles[0].qty,
                "[   ]",
            ]);

        } else if (reduced) {
            // FOR MIXED BOXES WITH REDUCED OPTION CHECKED
            let multiDesc = "";
            for (let j = 0; j < manifest.ssccs[i].articles.length; j++) {
                if (j % 3 == 0 && j != 0) multiDesc += "\n";
                multiDesc += (manifest.ssccs[i].articles[j].sku + " x" + manifest.ssccs[i].articles[j].qty + ",").padEnd(16);                
            }

            tableContent.push([
                manifest.ssccs[i].lastFour,
                "[MULTI]",
                multiDesc,
                manifest.ssccs[i].articles.length,
                "[   ]",
            ]);
        } else {
            // FOR MIXED BOXES WHEN REDUCED IS NOT CHECKED
            for (let j = 0; j < manifest.ssccs[i].articles.length; j++) {
                tableContent.push([
                    manifest.ssccs[i].lastFour,
                    manifest.ssccs[i].articles[j].sku,
                    manifest.ssccs[i].articles[j].desc,
                    manifest.ssccs[i].articles[j].qty,
                    "[   ]",
                ]);
            }
        }
        
    }

    // CREATE THE TABLE + PDF
    pdfMake.fonts = {
        mono: {
          normal: 'CourierPrime.ttf',
          bold: 'CourierPrimeBold.ttf',
          italics: 'CourierPrimeItalic.ttf',
          bolditalics: 'CourierPrimeBoldItalic.ttf'
        }
    }

    let header = "MANIFEST: " + manifest.manifestID;
    let PDFdocument = {
        defaultStyle: { font: "mono" },
        content: [
            { text: header, style: { fontSize: 18, bold: true } },
            {
                style: { fontSize: 10 },
                table: {
                    widths: ["auto", "auto", "*", "auto", "auto"],
                    body: tableContent,
                },
            },
        ]
    };

    manifestPDF = pdfMake.createPdf(PDFdocument);
    manifestPDF.getDataUrl(onCreatedPDF);
}

function onCreatedPDF(url) {
    // PDF CREATION CALLBACK
    // REVERT BUTTON + OPEN TODO
    manifestPDF.open();
}
