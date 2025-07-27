
export enum IssueSeverity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical',
}

export interface EthicalIssue {
    issueType: string;
    problematicPhrase: string;
    context: string;
    ethicalConcern: string;
    suggestion: string;
    severity: IssueSeverity;
}

export interface AnalysisReportData {
    summary: string;
    videoTitle: string;
    issues: EthicalIssue[];
    source?: string;
    analysisDate?: string;
}
