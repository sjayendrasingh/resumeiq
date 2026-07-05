const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service using Google Gemini (gemini-1.5-flash) to analyze resumes.
 * 
 * INTERVIEW HIGHLIGHT:
 * How to explain this in an interview:
 * 1. "I chose gemini-1.5-flash because it has high performance, fast latency, and a generous free tier for developers."
 * 2. "I used the SDK's `generationConfig` with `responseMimeType: 'application/json'` and `responseSchema` to guarantee the model's output conforms strictly to the JSON schema, preventing runtime parsing errors in Node.js."
 * 3. "The codebase isolates AI logic here. Swapping from Gemini to OpenAI is a simple matter of swapping this single file to use `openai` SDK."
 */

// Define response schema to enforce structured output structure directly from Gemini
const resumeAnalysisSchema = {
  type: "OBJECT",
  properties: {
    overallScore: { 
      type: "INTEGER", 
      description: "A score from 0 to 100 rating formatting, experience representation, and resume impact." 
    },
    atsScore: { 
      type: "INTEGER", 
      description: "Applicant Tracking System compatibility score from 0 to 100." 
    },
    jdMatchScore: {
      type: "INTEGER",
      description: "Match score between 0 and 100 matching resume to job description. If no job description is provided in the prompt, return 0."
    },
    strengths: { 
      type: "ARRAY", 
      items: { type: "STRING" }, 
      description: "Exactly 3 bulleted strengths of the resume (concise, professional sentences)." 
    },
    improvements: { 
      type: "ARRAY", 
      items: { type: "STRING" }, 
      description: "Exactly 3 actionable improvements/feedback tips to improve the scores (concise, professional sentences)." 
    },
    missingKeywords: { 
      type: "ARRAY", 
      items: { type: "STRING" }, 
      description: "List of 3-5 technical keywords or domain-specific skills missing or weak in the resume that are crucial for software roles." 
    }
  },
  required: ["overallScore", "atsScore", "jdMatchScore", "strengths", "improvements", "missingKeywords"]
};

// Initialize Gemini client if API key is provided
let genAI = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("⚠️ WARNING: GEMINI_API_KEY is not configured or contains placeholder. Running in Mockup/Demo Mode.");
}

/**
 * Analyzes resume plain text and compares it against an optional Job Description.
 * 
 * @param {string} resumeText - The parsed plain text from the resume.
 * @param {string} jobDescription - The optional target job description.
 * @returns {Promise<Object>} The structured JSON analysis.
 */
async function analyzeResumeText(resumeText, jobDescription = '') {
  const hasJd = jobDescription && jobDescription.trim().length > 0;

  // Mock fallback for easy local testing and demoing without API keys
  if (!genAI) {
    console.log("🛠️ Using Mockup Analysis Mode...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API network latency
    return {
      overallScore: 78,
      atsScore: 72,
      jdMatchScore: hasJd ? 64 : 0,
      strengths: [
        "Well-organized layout containing core developer contact info and Github links.",
        "Demonstrates solid foundation in MERN stack core principles (React, Node).",
        "Clear professional summary detailing motivation as a fresher software engineer."
      ],
      improvements: [
        "Include more quantifiable metrics (e.g., 'Improved load times by 25%' rather than 'Optimized database').",
        "Improve formatting in project bullet points by using active verbs (e.g. 'Architected', 'Implemented', 'Engineered').",
        "Integrate missing industry standard tools like Docker, Git branching flows, or CI/CD pipelines."
      ],
      missingKeywords: ["Docker", "CI/CD", "Redux Toolkit", "Jest", "TypeScript"]
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisSchema
      }
    });

    let prompt = `
You are an expert resume reviewer and technical recruiter specializing in Software Engineering, Web Development, and DevOps.
Analyze the following resume text extracted from a candidate's PDF. Provide objective scoring, strengths, improvements, and missing keywords.
`;

    if (hasJd) {
      prompt += `
Additionally, compare the resume against the provided Job Description. Set the 'jdMatchScore' property to represent how well the candidate fits the requirements (0-100). If no Job Description is provided, set 'jdMatchScore' to 0.

Job Description:
"""
${jobDescription}
"""
`;
    } else {
      prompt += `
No Job Description was provided. Set the 'jdMatchScore' property to 0.
`;
    }

    prompt += `
Resume Content:
---
${resumeText}
---
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // The response is guaranteed to be a JSON string matching our schema because of responseSchema
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
}

/**
 * INTERVIEW PORTFOLIO BONUS TIP:
 * To swap to OpenAI:
 * 
 * const { OpenAI } = require('openai');
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * 
 * async function analyzeResumeTextOpenAI(resumeText) {
 *   const response = await openai.chat.completions.create({
 *     model: "gpt-4o-mini",
 *     response_format: { type: "json_object" },
 *     messages: [
 *       { role: "system", content: "You analyze resumes and return JSON according to schema..." },
 *       { role: "user", content: resumeText }
 *     ]
 *   });
 *   return JSON.parse(response.choices[0].message.content);
 * }
 */

module.exports = { analyzeResumeText };
