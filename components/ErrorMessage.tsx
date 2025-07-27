
import React from 'react';
import { AlertTriangleIcon, RefreshIcon } from './icons';

interface ErrorMessageProps {
  message: string;
  onNewAnalysis: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onNewAnalysis }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1">
          <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-4" />
        </div>
        <div>
          <p className="font-bold">An Error Occurred</p>
          <p>{message}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900 transition-colors"
          aria-label="Start new analysis"
        >
          <RefreshIcon className="h-5 w-5" />
          Analyze Another
        </button>
      </div>
    </div>
  );
};
