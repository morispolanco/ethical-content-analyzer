import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Ethical Content Analyzer
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
          AI-powered analysis of ethical considerations in YouTube content.
        </p>
      </div>
    </header>
  );
};
