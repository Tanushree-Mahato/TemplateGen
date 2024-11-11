// controllers/uploadController.js
const path = require('path');
const fs = require('fs');
const { extractPdfContent, extractDocxContent } = require('../utils/fileUtils');

exports.uploadFile = async (req, res) => {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        let content;
        if (ext === '.pdf') {
            content = await extractPdfContent(filePath);
        } else if (ext === '.docx') {
            content = await extractDocxContent(filePath);
        } else {
            return res.status(400).json({ message: 'Unsupported file format' });
        }

        // Optionally, save content to the database or further process as needed
        // const template = new Template({ userId: req.user.id, name: req.file.originalname, content });
        // await template.save();

        res.status(201).json({ message: 'File uploaded and content extracted', content });
    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error });
    } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
    }
};
