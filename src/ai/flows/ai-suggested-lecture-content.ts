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
import { GenerateLectureContentInput, GenerateLectureContentOutput } from '@/lib/types';

export async function generateLectureContent(
  input: GenerateLectureContentInput
): Promise<GenerateLectureContentOutput> {
  return generateLectureContentFlow(input);
}

const prompt = `You are an AI assistant designed to generate structured lecture content for teachers.

Your output MUST be a valid JSON object that adheres to this TypeScript type:
type GenerateLectureContentOutput = {
  title: string;
  introduction: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  conclusion: string;
};

Based on the given topic(s), create a single cohesive lecture with a title, introduction, several sections (each with a heading and content), and a conclusion. 
The lecture should be comprehensive, well-organized, and suitable for a presentation of approximately {{duration}} minutes.
If multiple topics are provided, synthesize them into a coherent structure.
Do NOT include any text or markdown formatting outside of the main JSON object.

Topic(s): {{{topic}}}
`;

const generateLectureContentFlow = ai.defineFlow(
  {
    name: 'generateLectureContentFlow',
  },
  async (input: GenerateLectureContentInput): Promise<GenerateLectureContentOutput> => {
    // 1. Generate the text content
     const llmResponse = await ai.generate({
      prompt: prompt.replace('{{{topic}}}', input.topic).replace('{{{duration}}}', (input.duration || 30).toString()),
      config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
      },
    });

    let lecture: GenerateLectureContentOutput;
    try {
        const jsonText = llmResponse.text.replace(/```json\n?/, '').replace(/```$/, '');
        lecture = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", llmResponse.text);
        throw new Error(`The AI returned an invalid data format for the lecture text. Raw response: ${llmResponse.text}`);
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
          (section as any).imageUrl = media.url;
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
