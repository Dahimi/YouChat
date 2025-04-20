import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CommandPalette from '../components/CommandPalette';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  // Check API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        setApiStatus('online');
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
  }, []);

  // Handle keyboard shortcuts (Ctrl+K or Command+K to open command palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Function to handle video URL input
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setIsCommandOpen(true);
    }
  };

  // Extract YouTube video ID from URL (supports various YouTube URL formats)
  const getYouTubeVideoId = (url: string) => {
    // Handle standard youtube.com URLs
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  return (
    <>
      <Head>
        <title>YouChat - YouTube Video AI Assistant</title>
        <meta name="description" content="AI assistant for analyzing YouTube videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-background text-text">
        {/* Header */}
        <header className="border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">YouChat</h1>
            <div className="flex items-center gap-2">
              <div className="text-sm">
                API Status: 
                <span className={`ml-2 ${
                  apiStatus === 'online' ? 'text-green-500' : 
                  apiStatus === 'offline' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {apiStatus === 'online' ? 'Online' : 
                   apiStatus === 'offline' ? 'Offline' : 'Checking...'}
                </span>
              </div>
              <button 
                className="px-3 py-1 bg-surface rounded-md text-sm flex items-center gap-1 border border-gray-700 hover:bg-gray-800"
                onClick={() => setIsCommandOpen(true)}
                disabled={apiStatus !== 'online'}
              >
                <span>⌘K</span>
                <span>Open Command</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-surface p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Analyze a YouTube Video</h2>
              
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={handleVideoUrlChange}
                    placeholder="Paste YouTube URL here..."
                    className="flex-1 px-4 py-2 bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={apiStatus !== 'online'}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md text-white disabled:opacity-50"
                    disabled={!videoUrl.trim() || apiStatus !== 'online'}
                  >
                    Analyze
                  </button>
                </div>
              </form>

              {/* Preview of the video */}
              {videoId && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Video Preview</h3>
                  <div className="aspect-video bg-black rounded-md overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-surface p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">How to use YouChat</h2>
              <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                <li>Paste a YouTube video URL in the input field above.</li>
                <li>Press the "Analyze" button or use the keyboard shortcut <span className="px-1 py-0.5 bg-background rounded text-xs">Ctrl+K</span> or <span className="px-1 py-0.5 bg-background rounded text-xs">⌘+K</span>.</li>
                <li>Ask questions about the video content, request summaries, or timestamps for key moments.</li>
                <li>Get AI-powered insights instantly!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Command Palette */}
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          videoUrl={videoUrl}
        />
      </main>
    </>
  );
} 