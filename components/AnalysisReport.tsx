
import React, { useState } from 'react';
import { AnalysisReportData, EthicalIssue, IssueSeverity } from '../types';
import { AlertTriangleIcon, CheckCircleIcon, LightbulbIcon, DownloadIcon, RefreshIcon } from './icons';
import { Packer } from 'docx';
import { generateDocxFromReport } from '../services/docxService';

const severityConfig: { [key in IssueSeverity]: { icon: React.ReactNode; color: string; } } = {
  [IssueSeverity.Low]: { icon: <CheckCircleIcon className="h-5 w-5 text-yellow-500" />, color: 'border-l-yellow-500' },
  [IssueSeverity.Medium]: { icon: <AlertTriangleIcon className="h-5 w-5 text-orange-500" />, color: 'border-l-orange-500' },
  [IssueSeverity.High]: { icon: <AlertTriangleIcon className="h-5 w-5 text-red-500" />, color: 'border-l-red-500' },
  [IssueSeverity.Critical]: { icon: <AlertTriangleIcon className="h-5 w-5 text-red-700" />, color: 'border-l-red-700' },
};

const IssueCard: React.FC<{ issue: EthicalIssue }> = ({ issue }) => {
  const config = severityConfig[issue.severity] || severityConfig[IssueSeverity.Medium];

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6 border-l-4 ${config.color} overflow-hidden`}>
      <div className="p-5">
        <div className="flex items-center mb-3">
          {config.icon}
          <h3 className="ml-3 text-xl font-semibold text-slate-800 dark:text-slate-100">{issue.issueType}</h3>
          <span className={`ml-auto text-sm font-medium px-2 py-0.5 rounded-full ${config.color.replace('border-l', 'bg').replace('-500', '-100 dark:bg-opacity-20').replace('-700', '-200 dark:bg-opacity-20')} text-slate-800 dark:text-slate-200`}>{issue.severity}</span>
        </div>

        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Problematic Phrase</h4>
            <blockquote className="border-l-2 border-slate-300 dark:border-slate-600 pl-3 py-1 mt-1 italic">"{issue.problematicPhrase}"</blockquote>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Context</h4>
            <p className="mt-1">{issue.context}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Ethical Concern</h4>
            <p className="mt-1">{issue.ethicalConcern}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-start">
            <LightbulbIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <h4 className="font-semibold text-green-600 dark:text-green-400">Suggestion for Improvement</h4>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{issue.suggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const AnalysisReport: React.FC<{ report: AnalysisReportData, onNewAnalysis: () => void; }> = ({ report, onNewAnalysis }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
        const doc = generateDocxFromReport(report);
        const blob = await Packer.toBlob(doc);
        
        const sanitizedTitle = report.videoTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        const fileName = `ethical_report_${sanitizedTitle}.docx`;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Failed to export DOCX:", error);
        // In a real app, you might want to show a user-facing error message here.
    } finally {
        setIsExporting(false);
    }
  };


  return (
    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-0">Analysis for: <span className="text-blue-600 dark:text-blue-400">{report.videoTitle}</span></h2>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <DownloadIcon className="h-5 w-5" />
            {isExporting ? 'Exporting...' : 'Export to DOCX'}
          </button>
          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900 transition-colors"
            aria-label="Start new analysis"
          >
            <RefreshIcon className="h-5 w-5" />
            Analyze Another
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-2">Overall Summary</h3>
        <p className="text-blue-700 dark:text-blue-300/90">{report.summary}</p>
      </div>

      {report.issues.length > 0 ? (
        report.issues.map((issue, index) => <IssueCard key={index} issue={issue} />)
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4"/>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">No Major Ethical Issues Found</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md">Based on the analysis of the provided transcript, no significant ethical concerns were detected. The content appears to be suitable for its target audience.</p>
        </div>
      )}

      {report.analysisDate && report.source && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">Bibliographic Reference (APA-Style)</h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-900/50 p-4 rounded-lg">
                  <p className="font-mono text-xs md:text-sm break-words">
                      Polanco, M. (2025). Ethical Analysis of video: {report.source}. <em>Ethical Content Analyzer</em>. Retrieved {report.analysisDate} from https://ethical-content-analyzer.vercel.app/.
                  </p>
              </div>
          </div>
      )}
    </div>
  );
};
