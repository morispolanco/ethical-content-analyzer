
import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface InputFormProps {
  onAnalyze: (queryOrFile: string | File) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [query, setQuery] = useState<string>('https://www.youtube.com/watch?v=m_esT_wowGA');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAnalyze(query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyze(file);
    }
    // Reset file input value to allow re-uploading the same file
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="youtube-query" className="block text-lg font-medium text-slate-700 dark:text-slate-300">
          Analyze from YouTube URL
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Enter any YouTube URL. If a public transcript isn't available, the audio will be transcribed automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="youtube-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., https://www.youtube.com/watch?v=..."
            className="flex-grow w-full px-4 py-2 text-slate-900 bg-slate-100 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-slate-800 px-3 text-base font-medium text-slate-500 dark:text-slate-400">OR</span>
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium text-slate-700 dark:text-slate-300">
          Analyze from Audio or Video File
        </label>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Upload an audio or .mp4 video file directly for transcription and analysis.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="audio/*,video/mp4"
          disabled={isLoading}
        />
        <button
          onClick={handleFileButtonClick}
          disabled={isLoading}
          type="button"
          className="w-full flex justify-center items-center gap-3 px-6 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UploadIcon className="h-6 w-6" />
          <span className="font-semibold">{isLoading ? 'Processing...' : 'Select Media File'}</span>
        </button>
      </div>
    </div>
  );
};
