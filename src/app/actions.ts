'use server';

import { aiChatbot } from '@/ai/flows/ai-chatbot-doubt-solving';
import { generateLectureContent } from '@/ai/flows/ai-suggested-lecture-content';
import { generateRecordedLecture } from '@/ai/flows/ai-generated-recorded-lectures';
import { suggestLectureDetails } from '@/ai/flows/ai-suggest-lecture-details';
import type { GenerateLectureContentOutput, SuggestLectureDetailsOutput } from '@/lib/types';


const getBetterErrorMessage = (error: any, defaultMessage: string): string => {
  if (error && typeof error.message === 'string') {
    if (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable')) {
      return 'The AI model is currently busy or unavailable. Please try again in a few moments.';
    }
    if (error.message.includes('deadline')) {
      return 'The request to the AI model timed out. This can happen during peak hours. Please try again.';
    }
    if (error.message.includes('429') || error.message.toLowerCase().includes('quota exceeded')) {
      return 'You have exceeded the request limit for the free tier of the AI model. Please wait a few moments before trying again.';
    }
    if (error.message.includes('model `gemini-2.5-flash` is not found')) {
      return 'The specified AI model is not available. Please check the configuration.';
    }
    // For other errors, return the raw message for better debugging.
    return error.message;
  }
  return defaultMessage;
};


export async function getLectureContent(topic: string, duration: number): Promise<{ success: boolean, data?: GenerateLectureContentOutput, error?: string}> {
  try {
    const result = await generateLectureContent({ topic, duration });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in getLectureContent action:", error);
    const errorMessage = getBetterErrorMessage(error, 'Failed to generate lecture content.');
    return { success: false, error: errorMessage };
  }
}

export async function getRecordedLecture(script: string) {
  try {
    const result = await generateRecordedLecture({ script });
    return { success: true, data: result };
  } catch (error: any)
{
    console.error("Error in getRecordedLecture action:", error);
    const errorMessage = getBetterErrorMessage(error, 'Failed to generate recorded lecture.');
    return { success: false, error: errorMessage };
  }
}

export async function getChatbotResponse(question: string, availableResources: string) {
  try {
    const result = await aiChatbot({ question, availableResources });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in getChatbotResponse action:", error);
    const errorMessage = getBetterErrorMessage(error, 'Failed to get chatbot response.');
    return { success: false, error: errorMessage };
  }
}

export async function getSuggestedLectureDetails(courseTitle: string): Promise<{ success: boolean, data?: SuggestLectureDetailsOutput, error?: string }> {
  try {
    const result = await suggestLectureDetails({ courseTitle });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in getSuggestedLectureDetails action:", error);
    const errorMessage = getBetterErrorMessage(error, 'Failed to get lecture suggestions.');
    return { success: false, error: errorMessage };
  }
}
