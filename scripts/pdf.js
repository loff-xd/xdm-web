var manifestPDF;

export function createPDF(manifest, reduced) {
    //BUILD TABLE CONTENT
    if (reduced) {
        manifest.ssccs = manifest.ssccs.reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.sscc === current.sscc)) {
                accumulator.push(current);
            }
            return accumulator;
        }, []);
    }

    var tableContent = [["SSCC", "SKU", "DESCRIPTION", "QTY", "CHK"]];
    for (var i = 0; i < manifest.ssccs.length; i++) {
        tableContent.push([
            manifest.ssccs[i].lastFour,
            manifest.ssccs[i].sku,
            manifest.ssccs[i].desc,
            manifest.ssccs[i].qty,
            "[      ]",
        ]);
    }

    // CREATE THE TABLE + PDF
    var header = "MANIFEST: " + manifest.manifestID;
    var document = {
        style: { font: "courier" },
        content: [
            { text: header, style: { fontSize: 18, bold: true } },
            {
                style: { fontSize: 10 },
                table: {
                    widths: ["auto", "auto", "*", "auto", "auto"],
                    body: tableContent,
                },
            },
        ],
    };

    manifestPDF = pdfMake.createPdf(document);
    manifestPDF.getDataUrl(onCreatedPDF);
}

function onCreatedPDF(url) {
    // PDF CREATION CALLBACK
    // REVERT BUTTON + OPEN TODO
    manifestPDF.open();
}
