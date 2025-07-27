
import {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    ShadingType,
    BorderStyle
} from 'docx';
import { AnalysisReportData, EthicalIssue, IssueSeverity } from '../types';

const SEVERITY_CONFIG = {
    [IssueSeverity.Low]: { color: "FFC107", name: "Low" },
    [IssueSeverity.Medium]: { color: "FF9800", name: "Medium" },
    [IssueSeverity.High]: { color: "F44336", name: "High" },
    [IssueSeverity.Critical]: { color: "B71C1C", name: "Critical" },
};

const createSectionHeading = (text: string) => new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
});

const createSubHeading = (text: string) => new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24 })], // size is in half-points (12pt)
    spacing: { after: 100 },
});

export const generateDocxFromReport = (report: AnalysisReportData): Document => {
    const issueSections = report.issues.length > 0
        ? report.issues.flatMap((issue) => {
            const severity = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG[IssueSeverity.Medium];
            return [
                new Paragraph({
                    children: [new TextRun({ text: issue.issueType, size: 28, bold: true })], // 14pt
                    border: {
                        left: {
                            style: BorderStyle.SINGLE,
                            size: 18, // ~2.25pt
                            color: severity.color,
                            space: 4,
                        },
                    },
                    indent: { left: 200 },
                    spacing: { before: 300, after: 150 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Severity: ", bold: true, size: 22 }),
                        new TextRun({
                            text: ` ${severity.name} `,
                            shading: {
                                type: ShadingType.CLEAR,
                                fill: severity.color,
                                color: "auto",
                            },
                            size: 22,
                        }),
                    ],
                    style: "wellSpaced",
                    indent: { left: 200 },
                }),
                createSubHeading("Problematic Phrase"),
                new Paragraph({
                    children: [new TextRun({ text: `"${issue.problematicPhrase}"`, italics: true })],
                    style: "wellSpaced",
                    indent: { left: 400 }
                }),
                createSubHeading("Context"),
                new Paragraph({ text: issue.context, style: "wellSpaced", indent: { left: 400 } }),
                createSubHeading("Ethical Concern"),
                new Paragraph({ text: issue.ethicalConcern, style: "wellSpaced", indent: { left: 400 } }),
                createSubHeading("Suggestion for Improvement"),
                new Paragraph({ text: issue.suggestion, style: "wellSpaced", indent: { left: 400 } }),
                new Paragraph({ text: "" }), // spacer
            ];
        })
        : [new Paragraph({ text: "Based on the analysis, no significant ethical concerns were detected.", style: "wellSpaced" })];

    const referenceSection: Paragraph[] = [];
    if (report.analysisDate && report.source) {
        const year = new Date(report.analysisDate).getFullYear();
        referenceSection.push(
            createSectionHeading("Bibliographic Reference (APA-Style)")
        );
        referenceSection.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `Polanco, M. (${year}). `, size: 22 }),
                    new TextRun({ text: `Ethical Analysis of "${report.videoTitle}". `, italics: true, size: 22 }),
                    new TextRun({ text: `UFM Ethical Content Analyzer. Retrieved ${report.analysisDate} from ${report.source}.`, size: 22 }),
                ],
                style: "wellSpaced",
            })
        );
    }

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "wellSpaced",
                    name: "Well Spaced",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        size: 22, // 11pt
                    },
                    paragraph: {
                        spacing: { after: 120 }, // 6pt
                    },
                },
            ],
        },
        sections: [{
            children: [
                new Paragraph({ text: "Ethical Content Analysis Report", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "" }),
                createSectionHeading("Video Analyzed"),
                new Paragraph({ text: report.videoTitle, style: "wellSpaced" }),

                createSectionHeading("Overall Summary"),
                new Paragraph({ text: report.summary, style: "wellSpaced" }),

                createSectionHeading("Detailed Findings"),
                ...issueSections,
                ...referenceSection,
            ],
        }],
    });

    return doc;
};
