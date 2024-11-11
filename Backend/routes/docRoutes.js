const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, docController.generateDocument);
router.post('/getDoc', authMiddleware, docController.viewDocuments);
router.get('/getRecentDoc', authMiddleware, docController.viewRecentDocuments);
router.post('/download', authMiddleware, docController.downloadDocument);

module.exports = router;
