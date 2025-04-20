# YouChat

YouChat is a productivity tool that uses AI to help analyze, answer questions about, summarize, and find timestamps in YouTube videos.

## Features

- **Video Analysis**: Ask questions about any YouTube video content
- **Summarization**: Get quick summaries of long videos
- **Timestamp Finding**: Locate specific moments in videos
- **Elegant UI**: Clean and minimal command palette interface
- **Keyboard Shortcuts**: Quick access with Ctrl+K / Cmd+K

## Tech Stack

- **Backend**: Python with FastAPI
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **AI**: Google's Gemini API for video understanding
- **Video Processing**: yt-dlp for YouTube video handling

## Running the Project

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.9+
- Google Gemini API key

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
# Edit .env to add your Gemini API key

# Start the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Open the application in your browser
2. Paste a YouTube URL into the input field
3. Press the "Analyze" button or use the keyboard shortcut (Ctrl+K/Cmd+K)
4. Ask questions about the video in the command palette

## Future Enhancements

- Browser extension for direct integration with YouTube
- Support for more video platforms
- Video transcript extraction
- Collaborative sharing of AI insights

## License

MIT 