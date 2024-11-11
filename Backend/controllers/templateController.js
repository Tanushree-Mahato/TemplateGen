const Template = require('../models/Template');
const path = require('path');
const fs = require('fs');
const { extractDocxContent, extractPdfContent } = require('../utils/fileUtils');

exports.uploadTemplate = async (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const { name } = req.body;

  try {
    let content;
    if (ext === '.pdf') {
      content = await extractPdfContent(filePath);
    } else if (ext === '.docx') {
      content = await extractDocxContent(filePath);
    } else {
      return res.status(400).json({ message: 'Unsupported file format. Please upload a PDF or DOCX file.' });
    }

    const placeholders = Array.from(content.matchAll(/{{(.*?)}}/g)).map(match => match[1]);

    const template = new Template({
      userId: req.user.id,
      name,
      placeholders,
      content,
      path: filePath // Optionally, save content; otherwise, save just metadata and file path
    });
    await template.save();

    res.status(201).json({ message: 'Template uploaded successfully', template });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading template', error: error.message });
  }
};
exports.getTemplate = async (req, res) => {
  const user = req.user;
  const { page = 1, limit = 2, search } = req.body; 
  try {
    const query = { userId: user.id };
    if (search) {
      query.name = { $regex: search, $options: 'i' }; 
    }
    const templates = await Template.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit)) 
      .sort({ name: 1 }); 
    const totalTemplates = await Template.countDocuments(query);

    res.status(200).json({
      message: 'Templates fetched successfully',
      templates,
      totalPages: Math.ceil(totalTemplates / limit), 
      currentPage: Number(page), 
      totalTemplates,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};


exports.fillTemplate = async (req, res) => {
  const { templateId, placeholderValues } = req.body;

  try {
    if (!templateId || !placeholderValues || typeof placeholderValues !== 'object') {
      return res.status(400).json({ message: 'Template ID and placeholder values are required' });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    let filledContent = template.content;
    for (let [key, value] of Object.entries(placeholderValues)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      filledContent = filledContent.replace(regex, value);
    }

    res.status(200).json({ message: 'Template filled successfully', filledContent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};