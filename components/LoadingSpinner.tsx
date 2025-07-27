
import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
        {message || 'Processing...'}
      </p>
      <p className="text-slate-500 dark:text-slate-400">
        This may take a moment.
      </p>
    </div>
  );
};
