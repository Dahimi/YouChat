import React, { useState, useEffect, FormEvent } from 'react';
import { Command } from 'cmdk';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
};

export default function CommandPalette({ isOpen, onClose, videoUrl }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on escape
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Auto-focus the input when the palette opens
  useEffect(() => {
    if (isOpen) {
      document.getElementById('command-input')?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || !videoUrl) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        url: videoUrl,
        command: query,
      });
      
      setResult(response.data.text);
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl max-h-[70vh] bg-surface rounded-lg shadow-command overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col h-full">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-gray-800 px-4 py-3">
              <Command.Input
                id="command-input"
                value={query}
                onValueChange={setQuery}
                className="flex-1 bg-transparent border-none outline-none text-text placeholder:text-text-secondary"
                placeholder="Ask anything about this video..."
              />
              <button 
                type="submit"
                disabled={loading || !query.trim() || !videoUrl}
                className="ml-2 px-3 py-1 bg-primary hover:bg-primary-dark rounded text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Ask'}
              </button>
              <button 
                onClick={onClose}
                className="ml-2 p-1 text-text-secondary hover:text-text rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>

          <Command.List className="overflow-y-auto p-4">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2 mx-auto"></div>
                <p className="mt-4 text-text-secondary">Analyzing video...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 text-red-400">
                {error}
              </div>
            )}
            
            {result && !loading && (
              <div className="text-text whitespace-pre-wrap">
                {result}
              </div>
            )}
            
            {!result && !loading && !error && (
              <div className="text-center py-8 text-text-secondary">
                <p>Ask me to summarize the video, find key points, or answer specific questions about the content.</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['Summarize this video', 'What are the key points?', 'Find timestamps for important moments'].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-1 bg-surface border border-gray-700 rounded-full text-sm hover:bg-gray-800"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
} 