var manifest_pdf;

export function create_pdf(manifest) {

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

    submitButton.innerHTML = "...";  // SHOW GENERATION START
    submitButton.disabled = true;
    manifest_pdf = pdfMake.createPdf(document);
    manifest_pdf.getDataUrl(onCreatedPDF);

}

function onCreatedPDF(url){ // PDF CREATION CALLBACK
    // REVERT BUTTON + OPEN TODO
    submitButton.innerHTML = "SUBMIT";
    submitButton.disabled = false;
    manifest_pdf.open();
}