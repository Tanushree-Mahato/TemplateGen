const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', authMiddleware, upload.single('file'), templateController.uploadTemplate);
router.post('/getTemplates', authMiddleware, templateController.getTemplate);
router.post('/generate', authMiddleware, templateController.fillTemplate);

module.exports = router;
