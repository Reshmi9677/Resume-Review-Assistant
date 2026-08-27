
const express = require("express");
const path = require("path");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");
const ResumeAnalysis = require("./models/ResumeAnalysis");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

// Node.js .env file load karega
process.loadEnvFile();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {
        if (file.mimetype === "application/pdf") {
            callback(null, true);
        } else {
            callback(new Error("Only PDF files are allowed"));
        }
    }
});

// Gemini client create karna
async function createGeminiClient() {
    const { GoogleGenAI } = await import("@google/genai");

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
}


app.post(
    "/api/upload",
    upload.single("resume"),
    async (req, res) => {
        let parser;

        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a PDF resume"
                });
            }

            if (!process.env.GEMINI_API_KEY) {
                return res.status(500).json({
                    message: "Gemini API key is missing"
                });
            }

            // PDF text extraction
            parser = new PDFParse({
                data: req.file.buffer
            });

            const pdfResult = await parser.getText();
            const resumeText = pdfResult.text.trim();

            if (!resumeText) {
                return res.status(400).json({
                    message: "No readable text found in the PDF"
                });
            }

            const targetRole = req.body.targetRole?.trim() || "General";
            const jobDescription = req.body.jobDescription?.trim() || "";

            const ai = await createGeminiClient();

           const prompt = `
You are a professional ATS resume reviewer.

Analyze the resume for this target role:

Target role:
${targetRole}

Job description:
${jobDescription || "No job description was provided. Perform a general analysis based on the target role."}

Resume:
${resumeText}

Return ONLY valid JSON in this exact format:

{
  "atsScore": 0,
  "summary": "",
  "strengths": ["", "", ""],
  "improvements": ["", "", ""],
  "missingSkills": ["", "", ""]
}

Rules:
- ATS score must be between 0 and 100.
- If a job description is provided, compare the resume against it.
- Suggest only skills relevant to the target role or job description.
- Do not claim that a skill is compulsory unless it appears in the job description.
- Do not recommend adding skills the candidate does not actually know.
- Give exactly 3 strengths and exactly 3 practical improvements.
- Keep every point clear and concise.
- Do not include markdown formatting.
- Return only valid JSON.
`;

            console.log("Resume Gemini ko analysis ke liye bheja gaya");

const geminiResponse = await Promise.race([
    ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    }),

    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(
                new Error(
                    "Gemini response timed out. Please try again."
                )
            );
        }, 45000);
    })
]);

console.log("Gemini analysis received");

            // Gemini response se extra markdown remove karna
            const cleanedResponse = geminiResponse.text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

           const analysis = JSON.parse(cleanedResponse);

// MongoDB mein result save karna
const savedAnalysis = await ResumeAnalysis.create({
    fileName: req.file.originalname,
    atsScore: analysis.atsScore,
    summary: analysis.summary,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    missingSkills: analysis.missingSkills
});

console.log("Analysis saved in MongoDB");

res.status(200).json({
    message: "Resume analyzed and saved successfully",
    fileName: req.file.originalname,
    analysis: analysis,
    analysisId: savedAnalysis._id
});

       } catch (error) {
    // Actual error sirf developer ke terminal mein dikhega
    console.error("Analysis error:", error);

    // User ko simple and safe message milega
    res.status(500).json({
        message: "Resume analysis failed. Please try again."
    });
} finally {
            if (parser) {
                await parser.destroy();
            }
        }
    }
);

// React frontend ki production build serve karna
const clientDistPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

// Non-API routes par React website open karna
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        return res.sendFile(
            path.join(clientDistPath, "index.html")
        );
    }

    next();
});

app.use((error, req, res, next) => {
    res.status(400).json({
        message: error.message
    });
});

mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "resumeReviewAssistant"
    })
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(
                `Server is running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });