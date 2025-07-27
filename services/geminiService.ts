
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReportData } from '../types';
import { IssueSeverity } from '../types';

// Ensure process.env.API_KEY is available. In a real app, this is set by the environment.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, one-paragraph summary of the overall ethical health of the content."
        },
        videoTitle: {
            type: Type.STRING,
            description: "The title of the video or series being analyzed."
        },
        issues: {
            type: Type.ARRAY,
            description: "A list of potential ethical issues found in the transcript.",
            items: {
                type: Type.OBJECT,
                properties: {
                    issueType: {
                        type: Type.STRING,
                        description: "A category for the issue (e.g., 'Derogatory Language', 'Negative Stereotyping', 'Harmful Behavioral Modeling')."
                    },
                    problematicPhrase: {
                        type: Type.STRING,
                        description: "The exact quote or phrase that is problematic."
                    },
                    context: {
                        type: Type.STRING,
                        description: "The context in which the phrase was used in the transcript."
                    },
                    ethicalConcern: {
                        type: Type.STRING,
                        description: "A detailed explanation of why this is an ethical concern, especially for a young audience. Reference principles of child development, social learning theory, or media ethics."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A constructive suggestion for how to improve or rephrase the content to be more ethical."
                    },
                    severity: {
                        type: Type.STRING,
                        enum: [IssueSeverity.Low, IssueSeverity.Medium, IssueSeverity.High, IssueSeverity.Critical],
                        description: "An assessment of the severity of the issue."
                    }
                },
                required: ["issueType", "problematicPhrase", "context", "ethicalConcern", "suggestion", "severity"]
            }
        }
    },
    required: ["summary", "videoTitle", "issues"]
};

const systemInstruction = `You are an expert in child development and media ethics, specializing in analyzing content for young audiences (ages 2-6). Your task is to perform an ethical content analysis on the provided video transcript.

Your goal is to identify and report on any content that could be ethically problematic. Focus on the following areas:
1.  **Derogatory or Biased Language**: Words or phrases that are insulting, demeaning, or perpetuate bias.
2.  **Harmful Behavioral Modeling**: Actions or phrases that, if copied by a child, could lead to negative social outcomes. For example, a character calling another "tonto" (silly/stupid) might lead to a child calling their parent "tonto papá," which is a known issue from the series "Steve and Maggie". This is a critical pattern to detect.
3.  **Stereotyping**: Portrayals that reinforce simplistic and often negative stereotypes about groups of people.
4.  **Lack of Pro-social Resolution**: Conflicts or mistakes that are not resolved in a positive or educational manner.

Analyze the entire transcript provided and structure your findings strictly according to the provided JSON schema. If no issues are found, return an empty 'issues' array. Ensure the 'videoTitle' in the response matches the title provided in the prompt.`;


/**
 * Converts a File object to a GoogleGenAI.Part object with base64-encoded data.
 */
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            mimeType: file.type,
            data: await base64EncodedDataPromise
        }
    };
};

/**
 * Transcribes a local audio or video file using the Gemini API.
 * @param mediaFile The audio or video file to transcribe.
 * @returns A promise that resolves with the transcription text.
 */
export const transcribeAudio = async (mediaFile: File): Promise<string> => {
    try {
        const audioPart = await fileToGenerativePart(mediaFile);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [
                { text: "Transcribe this audio recording accurately. Provide only the text of the transcription, without any additional comments or formatting." },
                audioPart
            ]},
        });
        
        return response.text;

    } catch (error) {
        console.error("Error transcribing audio with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to transcribe audio: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during audio transcription.");
    }
};


export const analyzeTranscript = async (transcript: string, videoTitle: string): Promise<AnalysisReportData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please analyze the following transcript. The title of the content is "${videoTitle}".\n\n---\n${transcript}\n---`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2
            }
        });

        const jsonText = response.text.trim();
        const report = JSON.parse(jsonText) as AnalysisReportData;
        
        // Basic validation
        if (!report.summary || !report.videoTitle || !Array.isArray(report.issues)) {
          throw new Error("AI response is missing required fields.");
        }

        return report;

    } catch (error) {
        console.error("Error analyzing transcript with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get analysis from AI: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during AI analysis.");
    }
};
