'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating structured lecture content from a given topic.
 *
 * - `generateLectureContent`: A function that takes a topic and duration as input and returns structured lecture content with visuals.
 * - `GenerateLectureContentInput`: The input type for the `generateLectureContent` function.
 * - `GenerateLectureContentOutput`: The output type for the `generateLectureContent` function.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateLectureContentInput, 
  GenerateLectureContentInputSchema,
  GenerateLectureContentOutput, 
  GenerateLectureContentOutputSchema,
  GenerateLectureTextContent,
  GenerateLectureTextContentSchema
} from '@/lib/types';

export async function generateLectureContent(
  input: GenerateLectureContentInput
): Promise<GenerateLectureContentOutput> {
  return generateLectureContentFlow(input);
}

const lecturePrompt = ai.definePrompt({
  name: 'generateLectureContentPrompt',
  input: { schema: GenerateLectureContentInputSchema },
  output: { schema: GenerateLectureTextContentSchema },
  prompt: `You are an AI assistant designed to generate structured lecture content for teachers.

Based on the given topic, create a single cohesive lecture with a title, introduction, several sections (each with a heading and content), and a conclusion. 
The lecture should be comprehensive, well-organized, and suitable for a presentation of approximately {{duration}} minutes.
If multiple topics are provided, synthesize them into a coherent structure.

Topic(s): {{{topic}}}
`,
 config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
});

const generateLectureContentFlow = ai.defineFlow(
  {
    name: 'generateLectureContentFlow',
    inputSchema: GenerateLectureContentInputSchema,
    outputSchema: GenerateLectureContentOutputSchema,
  },
  async (input: GenerateLectureContentInput): Promise<GenerateLectureContentOutput> => {
    // 1. Generate the text content
    const { output: lectureText } = await lecturePrompt(input);
    
    if (!lectureText) {
        throw new Error(`The AI returned an invalid data format for the lecture text.`);
    }
    
    // 2. Map sections to the output format without adding images to avoid hitting API rate limits.
    const sectionsWithoutImages = lectureText.sections.map(section => ({
      ...section,
      imageUrl: undefined,
    }));
    
    // Construct the final output object that matches GenerateLectureContentOutputSchema
    const finalLecture: GenerateLectureContentOutput = {
      ...lectureText,
      sections: sectionsWithoutImages,
    };
    
    return finalLecture;
  }
);
