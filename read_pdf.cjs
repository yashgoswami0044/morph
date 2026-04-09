const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'c:\\my propjects\\morph\\public\\2041 (Autosaved).xlsx - Civl Costing Final.pdf';
const outPath = 'c:\\my propjects\\morph\\temp_pdf.txt';

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync(outPath, data.text);
    console.log("Extraction complete. Pages: " + data.numpages);
}).catch(function(error){
    console.error("Error", error);
});
