# Resume Wise – AI Resume Review Assistant

Resume Wise is a full-stack AI-powered application that analyzes PDF resumes and provides an ATS score, strengths, improvement suggestions, and relevant skills. Users can also add a target role and job description for job-specific feedback.

## Features

- PDF resume upload and text extraction
- AI-generated ATS score
- Resume strengths and improvement suggestions
- Target role and job-description comparison
- Relevant skill recommendations
- MongoDB analysis storage
- Responsive user interface
- PDF validation with a 5 MB upload limit

## Tech Stack

- **Frontend:** React.js, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB, Mongoose
- **AI:** Google Gemini API
- **Libraries:** Multer, PDF Parse

## How It Works

```text
Resume + Target Role/Job Description
                ↓
         PDF Text Extraction
                ↓
        Gemini AI Analysis
                ↓
 ATS Score, Strengths and Suggestions
                ↓
       Result Saved in MongoDB
```

## Project Structure

```text
Resume-Review-Assistant/
├── client/                  # React frontend
├── server/
│   ├── models/              # Mongoose models
│   └── server.js            # Express backend
└── README.md
```

## Run Locally

Clone the repository:

```bash
git clone https://github.com/Reshmi9677/Resume-Review-Assistant.git
cd Resume-Review-Assistant
```

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
cd server
node server.js
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

## API

```http
POST /api/upload
```

The API accepts:

- `resume` – PDF file
- `targetRole` – target job role
- `jobDescription` – optional job requirements

## Future Improvements

- User authentication
- Resume analysis history
- Downloadable analysis reports
- Resume-to-job match percentage



[GitHub](https://github.com/Reshmi9677) · [Project Repository](https://github.com/Reshmi9677/Resume-Review-Assistant)

> AI feedback is provided as guidance. Users should only add skills and experience they genuinely possess.
