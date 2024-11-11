const GeneratedDocument = require('../models/GenerateDocument');
const Template = require('../models/Template');
const { createDocx, generateDocxFromTemplate, createPdf } = require('../utils/documentUtils');
const fs = require('fs');
const path = require('path');

exports.generateDocument = async (req, res) => {
  try {
    const { templateId, data, format } = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    let generatedContent = template.content;
    for (const [key, value] of Object.entries(data)) {
      generatedContent = generatedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const document = new GeneratedDocument({
      templateId,
      userId: req.user.id,
      data,
      generatedContent,
      format: format.toUpperCase(),
    });
    await document.save();
    res.status(201).json({ message: 'Document generated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error generating document', error });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const doc = await GeneratedDocument.findById(req.body.id).populate('templateId');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    
    const condata = Object.fromEntries(doc.data);
    let fileBuffer;
    let filePath;
    const fileName = `temp_output${doc._id}.${doc.format.toLowerCase()}`;
    
    // Ensure export directory exists
    const exportDir = path.join(__dirname, '../export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    if (doc.format === 'DOCX') {
      fileBuffer = await generateDocxFromTemplate(doc.templateId.path, condata);
      filePath = path.join(exportDir, fileName);
      fs.writeFileSync(filePath, fileBuffer);
    } else if (doc.format === 'PDF') {
      fileBuffer = await createPdf(doc.generatedContent);
      filePath = path.join(exportDir, fileName);
      fs.writeFileSync(filePath, fileBuffer);
    }

    // Generate the full URL path
    const fileUrl = `${req.protocol}://${req.get('host')}/export/${fileName}`;
    res.status(200).json({ message: 'Document generated successfully', fileUrl });

  } catch (error) {
    res.status(500).json({ message: 'Error generating document', error });
  }
  };
exports.viewDocuments = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const documents = await GeneratedDocument.find({userId: req.user.id})
      .skip(skip) 
      .limit(limit) 
      .populate('templateId'); 
    const totalDocuments = await GeneratedDocument.countDocuments();

    res.status(200).json({
      message: 'Documents found successfully',
      pagination: {
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
      },
      documents: documents.map(doc => ({
        id: doc._id,
        content: doc.generatedContent,
        format: doc.format,
        createdAt: doc.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

exports.viewRecentDocuments = async (req, res) => {
  try {
    const currentTime = new Date();
    const twoHoursAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000); 
    const recentDocuments = await GeneratedDocument.find({
      userId: req.user.id,
      $or: [
        { createdAt: { $gte: twoHoursAgo } },  
        { updatedAt: { $gte: twoHoursAgo } }  
      ]
    }).populate('templateId');

    // If no recent documents are found
    if (recentDocuments.length === 0) {
      return res.status(404).json({ message: 'No recent documents found' });
    }

    // Return the recent documents
    res.status(200).json({
      message: 'Recent documents found successfully',
      documents: recentDocuments.map(doc => ({
        id: doc._id,
        content: doc.generatedContent,
        format: doc.format,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent documents', error });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const docId = req.params.id;

    // Find the document by ID
    const doc = await GeneratedDocument.findById(docId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Construct the file path for the document
    const exportDir = path.join(__dirname, 'export');
    let filePath = '';

    if (doc.format === 'DOCX') {
      filePath = path.join(exportDir, `temp_output${docId}.docx`);
    } else if (doc.format === 'PDF') {
      filePath = path.join(exportDir, `temp_output${docId}.pdf`);
    }

    // Check if the file exists, then delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);  // Remove the file from the file system
    }

    // Delete the document from the database
    await doc.remove();

    res.status(200).json({ message: 'Document and its associated file deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting document', error });
  }
};