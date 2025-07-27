
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
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
    </div>
  );
};
