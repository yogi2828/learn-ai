'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating structured lecture content from a given topic.
 *
 * - `generateLectureContent`: A function that takes a topic and duration as input and returns structured lecture content.
 * - `GenerateLectureContentInput`: The input type for the `generateLectureContent` function.
 * - `GenerateLectureContentOutput`: The output type for the `generateLectureContent` function.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateLectureContentInput, 
  GenerateLectureContentInputSchema,
  GenerateLectureContentOutput, 
  GenerateLectureContentOutputSchema,
} from '@/lib/types';

export async function generateLectureContent(
  input: GenerateLectureContentInput
): Promise<GenerateLectureContentOutput> {
  return generateLectureContentFlow(input);
}

const lecturePrompt = ai.definePrompt({
  name: 'generateLectureContentPrompt',
  input: { schema: GenerateLectureContentInputSchema },
  output: { schema: GenerateLectureContentOutputSchema },
  system: `You are an AI assistant. You MUST produce a valid JSON object that adheres to the provided output schema. Do not add any extra text or formatting outside of the JSON structure.
You are a passionate and engaging computer science professor. Your goal is to make complex topics exciting and easy to understand.
For the given topic, generate a comprehensive and detailed lecture script. Use analogies, ask rhetorical questions, and maintain an enthusiastic and slightly informal tone throughout the introduction, sections, and conclusion. Make the content rich and substantial.`,
  prompt: `Generate a lecture for the following topic.

Topic: {{{topic}}}
Approximate Duration: {{duration}} minutes
`,
 config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
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
    const { output } = await lecturePrompt(input);
    
    if (!output) {
        throw new Error(`The AI returned an invalid or empty data format for the lecture text.`);
    }
    
    return output;
  }
);
