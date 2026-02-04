'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating structured lecture content from a given topic.
 *
 * - `generateLectureContent`: A function that takes a topic and duration as input and returns structured lecture content with visuals.
 * - `GenerateLectureContentInput`: The input type for the `generateLectureContent` function.
 * - `GenerateLectureContentOutput`: The output type for the `generateLectureContent` function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { 
  GenerateLectureContentInput, 
  GenerateLectureContentInputSchema,
  GenerateLectureContentOutput, 
  GenerateLectureContentOutputSchema
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
  prompt: `You are an AI assistant designed to generate structured lecture content for teachers.

Based on the given topic, create a single cohesive lecture with a title, introduction, several sections (each with a heading and content), and a conclusion. 
The lecture should be comprehensive, well-organized, and suitable for a presentation of approximately {{duration}} minutes.
If multiple topics are provided, synthesize them into a coherent structure.

Topic(s): {{{topic}}}
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
    // 1. Generate the text content
    const { output: lecture } = await lecturePrompt(input);
    
    if (!lecture) {
        throw new Error(`The AI returned an invalid data format for the lecture text.`);
    }
    
    // 2. Generate an image for each section
    const imagePromises = lecture.sections.map(async (section) => {
      try {
        const imagePrompt = `A visually engaging and educational illustration for a computer science lecture section titled "${section.heading}". The content is about: "${section.content}". The image should be an abstract, conceptual, and simple vector-style graphic suitable for a presentation slide. Do not include any text in the image.`;
        const { media } = await ai.generate({
          model: googleAI.model('imagen-4.0-fast-generate-001'),
          prompt: imagePrompt,
        });
        if (media.url) {
          section.imageUrl = media.url;
        }
      } catch (e) {
        console.error(`Failed to generate image for section "${section.heading}":`, e);
        // Don't fail the whole flow, just skip the image for this section.
      }
      return section;
    });

    lecture.sections = await Promise.all(imagePromises);
    
    return lecture;
  }
);
