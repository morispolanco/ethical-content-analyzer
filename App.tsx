
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { AnalysisReport } from './components/AnalysisReport';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { getTranscriptFromUrl, transcribeAudioFromUrl } from './services/youtubeService';
import { analyzeTranscript, transcribeAudio as transcribeFile } from './services/geminiService';
import type { AnalysisReportData } from './types';
import { IntroContent } from './components/IntroContent';


export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleAnalyze = useCallback(async (queryOrFile: string | File) => {
    if (!queryOrFile) {
      setError("Please enter a YouTube URL or select a media file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setIsInitialState(false);

    try {
      let transcript = '';
      let videoTitle = '';

      if (typeof queryOrFile === 'string') {
        const videoUrl = queryOrFile;
        setLoadingMessage('Checking for YouTube transcript...');
        const { transcript: fetchedTranscript, videoId } = await getTranscriptFromUrl(videoUrl);
        
        videoTitle = `Analysis for video: ${videoId}`;

        if (fetchedTranscript) {
          transcript = fetchedTranscript;
        } else {
          // No transcript found, proceed to transcribe via "server-side" service
          setLoadingMessage('No transcript found. Transcribing audio from URL...');
          transcript = await transcribeAudioFromUrl(videoId);
        }
      } else {
        const file = queryOrFile;
        const isVideo = file.type.startsWith('video/');
        setLoadingMessage(isVideo ? 'Extracting audio and transcribing video...' : 'Transcribing audio file...');
        
        transcript = await transcribeFile(file);
        if (!transcript) {
          throw new Error("The media file could not be transcribed or was empty.");
        }
        videoTitle = `Analysis for: ${file.name}`;
      }

      setLoadingMessage('Analyzing transcript...');
      const result = await analyzeTranscript(transcript, videoTitle);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          <div className="mt-8">
            {isInitialState && <IntroContent />}
            {isLoading && <LoadingSpinner message={loadingMessage} />}
            {error && <ErrorMessage message={error} />}
            {analysisResult && <AnalysisReport report={analysisResult} />}
          </div>
        </div>
      </main>
    </div>
  );
}
