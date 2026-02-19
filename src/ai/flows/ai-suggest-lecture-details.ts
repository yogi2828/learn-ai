'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting lecture details.
 *
 * - `suggestLectureDetails`: A function that takes a course title and returns a suggested topic and duration.
 * - `SuggestLectureDetailsInputSchema`: The input type for the `suggestLectureDetails` function.
 * - `SuggestLectureDetailsOutputSchema`: The output type for the `suggestLectureDetails` function.
 */

import { ai } from '@/ai/genkit';
import { 
  SuggestLectureDetailsInput, 
  SuggestLectureDetailsInputSchema, 
  SuggestLectureDetailsOutput, 
  SuggestLectureDetailsOutputSchema 
} from '@/lib/types';


export async function suggestLectureDetails(input: SuggestLectureDetailsInput): Promise<SuggestLectureDetailsOutput> {
  return suggestLectureDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLectureDetailsPrompt',
  input: { schema: SuggestLectureDetailsInputSchema },
  output: { schema: SuggestLectureDetailsOutputSchema },
  prompt: `You are a curriculum designer for a tech university. For the given course, suggest a single, specific, and engaging lecture topic. Also suggest an appropriate duration from the available options. The topic should be suitable for a single lecture.

Course: {{{courseTitle}}}
`,
   config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
    ],
  },
});

const suggestLectureDetailsFlow = ai.defineFlow(
  {
    name: 'suggestLectureDetailsFlow',
    inputSchema: SuggestLectureDetailsInputSchema,
    outputSchema: SuggestLectureDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get lecture suggestions from AI.');
    }
    return output;
  }
);
