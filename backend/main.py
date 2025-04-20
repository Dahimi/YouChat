import os
import tempfile
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
from google import genai
from google.genai import types

app = FastAPI(title="YouChat API")

# Load allowed origins from environment variable
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Add CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = 'models/gemini-2.0-flash'

class VideoRequest(BaseModel):
    url: str
    command: str

class CacheRequest(BaseModel):
    url: str

@app.post("/analyze")
async def analyze_video(request: VideoRequest):
    """
    Analyze a YouTube video with a specific command/question
    """
    try:
        # Direct analysis without downloading (using URL)
        response = client.models.generate_content(
            model=MODEL,
            contents=types.Content(
                parts=[
                    types.Part(text=request.command),
                    types.Part(
                        file_data=types.FileData(file_uri=request.url)
                    )
                ]
            )
        )
        
        return {
            "text": response.text,
            "metadata": str(response.usage_metadata)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cache")
async def cache_video(request: CacheRequest, background_tasks: BackgroundTasks):
    """
    Cache a YouTube video for faster subsequent analysis
    """
    try:
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
            temp_path = temp_file.name
            
        # Download video in background
        background_tasks.add_task(download_and_cache_video, request.url, temp_path)
        
        return {"status": "Video caching started in the background"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def download_and_cache_video(url, download_path):
    """Background task to download and cache a video"""
    try:
        # Download the video
        ydl_opts = {
            'format': 'best',
            'outtmpl': download_path,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        # Upload to Gemini and create cache
        video_file = client.files.upload(file=download_path)
        
        # Use a frozen model for caching
        cache = client.caches.create(
            model="models/gemini-1.5-flash-001",
            config={
                'contents': [video_file],
                'system_instruction': 'You are an expert at analyzing youtube videos.',
            },
        )
        
        # Clean up the temp file
        os.remove(download_path)
        
        return cache.name
    except Exception as e:
        print(f"Error in background task: {e}")
        if os.path.exists(download_path):
            os.remove(download_path)

@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 