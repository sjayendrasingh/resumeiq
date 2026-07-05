const pdf = require('pdf-parse');

/**
 * Extracts raw text content from a PDF file buffer.
 * In an interview, explain that pdf-parse extracts characters, lines, and metadata
 * from the compiled PDF stream without needing external system CLI tools (like pdftotext).
 * 
 * @param {Buffer} pdfBuffer - The uploaded file's raw binary buffer.
 * @returns {Promise<string>} The extracted plain text from the PDF.
 */
async function parseResumePDF(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    
    // Clean and normalize spacing/newlines slightly for cleaner text
    let cleanText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    return cleanText;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

module.exports = { parseResumePDF };
