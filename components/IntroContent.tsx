import React from 'react';
import { BeakerIcon } from './icons';

export const IntroContent: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <BeakerIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome to the Ethical Content Analyzer</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                This tool uses AI to analyze video content for potential ethical concerns, helping creators produce safe and responsible content.
            </p>
            <div className="mt-6 text-left bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg max-w-xl mx-auto">
                <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">How to Get Started</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    <li>
                        **Analyze by URL:** Enter any YouTube URL. The system will first look for a public transcript. If one isn't available, it will automatically process the video's audio to generate a transcript before analysis.
                    </li>
                    <li>
                        **Analyze by File Upload:** For offline content, upload your own **audio or .mp4 video file**. The AI will transcribe it and perform the same full ethical analysis.
                    </li>
                </ul>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-8">
                Developed by Dr. Mois Polanco, mp@ufm.edu
            </p>
        </div>
    );
};
