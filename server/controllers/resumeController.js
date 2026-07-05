const Resume = require('../models/Resume');
const { parseResumePDF } = require('../utils/pdfParser');
const { analyzeResumeText } = require('../utils/aiService');

/**
 * Controller to handle Resume file uploads, text extraction, AI analysis, and database tracking.
 * 
 * INTERVIEW HIGHLIGHT:
 * How to explain this in an interview:
 * 1. "Instead of writing files to local disk (which causes storage leakages and fails on serverless deployments like Vercel/Render), 
 *     I configured Multer to use memory storage. This provides the uploaded file directly as a Buffer in `req.file.buffer`."
 * 2. "We process the buffer synchronously through pdf-parse to extract text, and immediately ship it to our AI Service."
 * 3. "We save the full record in MongoDB, linking it to the authenticated User's ObjectId (`req.user.id`). This builds the dashboard history feed."
 */

// Upload & Analyze Resume
exports.uploadAndAnalyze = async (req, res) => {
  try {
    // 1. Verify file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume file.' });
    }

    // Ensure it's a PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are supported.' });
    }

    const { jobDescription } = req.body;
    const fileName = req.file.originalname;

    console.log(`Processing file: ${fileName}...`);

    // 2. Parse PDF text content
    const extractedText = await parseResumePDF(req.file.buffer);
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from this PDF. Please check if it is scanned/image-only.' });
    }

    console.log(`Text extracted successfully (${extractedText.length} characters). Initiating Gemini analysis...`);

    // 3. Request structured AI Analysis
    const analysis = await analyzeResumeText(extractedText, jobDescription);

    // 4. Save analysis details to MongoDB
    const newResume = new Resume({
      userId: req.user.id,
      fileName,
      extractedText,
      analysis: {
        overallScore: analysis.overallScore,
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        missingKeywords: analysis.missingKeywords
      },
      jobDescription: jobDescription || '',
      jdMatchScore: analysis.jdMatchScore || 0
    });

    const savedResume = await newResume.save();
    console.log(`Analysis complete and saved under ID: ${savedResume._id}`);

    res.status(201).json(savedResume);
  } catch (error) {
    console.error('Resume upload/analysis error:', error);
    res.status(500).json({ message: `Error analyzing resume: ${error.message}` });
  }
};

// Retrieve User's Upload History
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch resumes matching user, sort by latest first
    const resumes = await Resume.find({ userId })
      .select('-extractedText') // Exclude heavy text payload to optimize response size
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Server error fetching resume history.' });
  }
};

// Retrieve Specific Resume Analysis by ID
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis record not found.' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Fetch resume details error:', error);
    res.status(500).json({ message: 'Server error retrieving analysis details.' });
  }
};

// Delete Resume Record
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis record not found or unauthorized.' });
    }
    res.json({ message: 'Resume analysis record deleted successfully.' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error deleting analysis record.' });
  }
};
