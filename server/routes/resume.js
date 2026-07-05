const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Set up Multer memory storage configuration (keeps file in memory buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are supported!'), false);
    }
  }
});

// Protect all resume routes
router.use(authMiddleware);

// Upload and Analyze PDF
// Expected Form-Data Fields: 'resume' (file), 'jobDescription' (string, optional)
router.post('/analyze', upload.single('resume'), resumeController.uploadAndAnalyze);

// Get History
router.get('/history', resumeController.getHistory);

// Get Details of a single Resume analysis
router.get('/:id', resumeController.getResumeById);

// Delete an analysis record
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
