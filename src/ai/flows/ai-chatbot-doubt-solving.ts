'use server';

/**
 * @fileOverview An AI chatbot for answering student questions about course material.
 *
 * - aiChatbot - A function that answers student questions using available resources.
 * - AIChatbotInput - The input type for the aiChatbot function.
 * - AIChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';

const AIChatbotInputSchema = z.object({
    question: z.string().describe("The student's question."),
    availableResources: z.string().describe("The course material to use as context for answering the question."),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
    answer: z.string().describe("The AI's answer to the student's question."),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;


export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: { schema: AIChatbotInputSchema },
  output: { schema: AIChatbotOutputSchema },
  prompt: `You are an expert AI assistant for college students, specializing in computer science topics. Your role is to answer student questions clearly and concisely.

Use the provided "Available Resources" to form your answer. If the resources do not contain the answer, state that you do not have enough information from the provided material but try to answer based on your general knowledge.

Always be helpful and encouraging.

Question: {{{question}}}

Available Resources: {{{availableResources}}}
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  }
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async (input: AIChatbotInput): Promise<AIChatbotOutput> => {
    const {output} = await prompt(input);
    if (!output) {
      return { answer: "I'm sorry, I couldn't generate a response. Please try again." };
    }
    return output;
  }
);
