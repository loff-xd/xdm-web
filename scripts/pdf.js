var manifest_pdf;

export function create_pdf(manifest, reduced) {

    //BUILD TABLE CONTENT
    if (reduced) {
        manifest.ssccs = manifest.ssccs.reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.sscc === current.sscc)) {
              accumulator.push(current);
            }
            return accumulator;
          }, []);
    }

    var table_content = [["SSCC", "SKU", "DESCRIPTION", "QTY", "CHK"]];
    for (var i=0; i<manifest.ssccs.length; i++){
        table_content.push([manifest.ssccs[i].lastFour, manifest.ssccs[i].sku, manifest.ssccs[i].desc, manifest.ssccs[i].qty, "[      ]"]);
    }


    var header = "MANIFEST: " + manifest.manifestID;
    // CREATE THE TABLE + PDF
    var document = {
        style: {font: 'courier'},
        content: [
            {text: header, style: {fontSize: 18, bold: true}},
            {
                style: {fontSize: 10},
                table: {
                    widths: ["auto", "auto", "*", "auto", "auto"],
                    body: table_content
                }
            }
        ]
    }

    manifest_pdf = pdfMake.createPdf(document);
    manifest_pdf.getDataUrl(onCreatedPDF);

}

function onCreatedPDF(url){ // PDF CREATION CALLBACK
    // REVERT BUTTON + OPEN TODO
    manifest_pdf.open();
}