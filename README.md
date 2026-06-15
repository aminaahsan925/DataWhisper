# 🤖 DataWhisper - AI-Powered Data Analysis Chatbot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-blue)](https://www.python.org/)
[![Node.js 18+](https://img.shields.io/badge/node-18%2B-green)](https://nodejs.org/)

> **Upload a CSV or Excel file, ask questions in natural English, and get instant AI-powered insights powered by Google Gemini AI.**

DataWhisper is a full-stack web application that combines the power of FastAPI backend and Next.js frontend to provide intelligent data analysis through conversational AI.

## ✨ Features

- 📊 **Multi-Format Support**: Upload CSV, XLSX, and XLS files
- 🤖 **AI-Powered Analysis**: Powered by Google Gemini 1.5 Flash model
- 💬 **Natural Language Queries**: Ask questions about your data in plain English
- ⚡ **Real-Time Processing**: Instant data parsing and analysis
- 📈 **Data Preview**: View first 5 rows of your dataset before analysis
- 🎨 **Modern UI**: Beautiful, responsive dark-themed interface
- 🔒 **Privacy-Focused**: Data processed in-memory, no persistent storage
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **FastAPI** 0.115.0 - Modern, fast web framework
- **Python** 3.12+ - Core language
- **Pandas** 2.2.2 - Data manipulation and analysis
- **Google Generative AI** 0.7.2 - Gemini AI integration
- **Pydantic** 2.8.2 - Data validation

### Frontend
- **Next.js** 16.2.9 - React framework
- **React** 19.2.4 - UI library
- **TypeScript** 5+ - Type safety
- **Tailwind CSS** 4 - Styling

## 📋 Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- npm or yarn package manager
- Google Generative AI API key (free from [makersuite.google.com](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/aminaahsan925/DataWhisper.git
cd DataWhisper
```

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your-key-here

# Start the backend server
python -m uvicorn main:app --reload
```

Backend should be running at `http://localhost:8000`

### 4. Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo 'NEXT_PUBLIC_BACKEND_URL=http://localhost:8000' > .env.local

# Start the development server
npm run dev
```

Frontend should be running at `http://localhost:3000`

### 5. Access the Application

Open your browser and visit: **http://localhost:3000**

## 📖 Usage

1. **Upload Data**: Click to upload or drag-and-drop a CSV/Excel file
2. **Preview Data**: View the first 5 rows to confirm data integrity
3. **Ask Questions**: Type questions about your data in natural language
4. **Get Insights**: Receive AI-powered analysis instantly

### Example Questions

- "What is the average sales revenue?"
- "Which product has the highest growth rate?"
- "Show me the top 3 customers by total purchases"
- "What's the trend in monthly sales?"
- "Identify any outliers in the dataset"

## 📁 Project Structure

```
DataWhisper/
├── backend/
│   ├── main.py                 # FastAPI application & endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (create from .env.example)
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── api.ts             # API client utilities
│   ├── package.json           # JavaScript dependencies
│   └── .env.local             # Frontend env vars
├── .env.example               # Example environment variables
├── README.md                  # This file
└── LICENSE                    # MIT License
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your-api-key-here
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:8000/

# API documentation
curl http://localhost:8000/docs
```

### Upload a File

```bash
curl -X POST -F "file=@data.csv" http://localhost:8000/upload
```

### Analyze Data

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"filename": "data.csv", "question": "What is the average value?"}'
```

## 📊 API Endpoints

### Health & Info
- `GET /` - API health check
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

### File Operations
- `POST /upload` - Upload and parse a data file
- `DELETE /clear` - Clear all uploaded data from memory

### Analysis
- `POST /analyze` - Analyze data with an AI question

## ⚠️ Important Notes

- **Data Storage**: Currently uses in-memory storage. Data is cleared when the server restarts.
- **File Size**: No hard limit, but very large files may cause slowdowns
- **API Rate Limiting**: Subject to Google's rate limits for Gemini API
- **CORS**: Currently allows all origins for development. Restrict in production.

## 🚀 Deployment

### Deploy Backend (Example: Heroku/Railway)

1. Create a `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. Set environment variable on hosting platform:
   ```
   GEMINI_API_KEY=your-key-here
   ```

3. Deploy and note your backend URL

### Deploy Frontend (Example: Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amina Ahsan**
- GitHub: [@aminaahsan925](https://github.com/aminaahsan925)
- Student at University of the Punjab

## 🎓 Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for Gemini API
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [Next.js](https://nextjs.org/) for the React framework
- [Pandas](https://pandas.pydata.org/) for data manipulation

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/aminaahsan925/DataWhisper/issues) page
2. Create a new issue with details about your problem
3. Include error messages and steps to reproduce

## 🗺️ Roadmap

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] User authentication and accounts
- [ ] Data export (PDF, Excel, JSON)
- [ ] Advanced charting and visualization
- [ ] File upload history
- [ ] Rate limiting and quotas
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

---

**Built with ❤️ by Amina Ahsan**
