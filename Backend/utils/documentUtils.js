// utils/documentUtils.js
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
/**
 * Generate a DOCX document from provided content
 * @param {string} content - The text content to be included in the DOCX document
 * @returns {Promise<Buffer>} - Buffer of the generated DOCX document
 */
exports.generateDocxFromTemplate = (templatePath, data) => {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        delimiters: { start: '{{', end: '}}' }
    });
    // Set data for placeholders
    doc.setData(data);

    try {
        doc.render();
        const buffer = doc.getZip().generate({ type: 'nodebuffer' });
        return buffer;
    } catch (error) {
        throw error;
    }
};
exports.generatePdfFromTemplate = async (templatePath, data) => {
    // Load the PDF template
    const content = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(content);

    // Get the font and font size
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;

    // Loop through each page in the document
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
        const { width, height } = page.getSize();

        // Loop through data and replace placeholders
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            const text = data[key];

            // Adjust coordinates based on template design; placeholders must be correctly positioned
            const x = 100; // Set x-coordinate or calculate dynamically
            const y = height - 50; // Set y-coordinate or calculate dynamically

            // Draw the text on the page
            page.drawText(text, {
                x: x,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0), // Black text color
            });
        });
    });

    // Save the modified PDF and return it as a buffer
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
exports.createDocx = async (content) => {
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [new TextRun(content)],
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
};

/**
 * Generate a PDF document from provided content
 * @param {string} content - The text content to be included in the PDF document
 * @returns {Promise<Buffer>} - Buffer of the generated PDF document
 */
exports.createPdf = async (content) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const { width, height } = page.getSize();

    page.drawText(content, {
        x: 50,
        y: height - 100,
        size: 12,
        maxWidth: width - 100,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
