'use server';

import { aiChatbot } from '@/ai/flows/ai-chatbot-doubt-solving';
import { generateLectureContent } from '@/ai/flows/ai-suggested-lecture-content';
import { generateRecordedLecture } from '@/ai/flows/ai-generated-recorded-lectures';
import { suggestLectureDetails } from '@/ai/flows/ai-suggest-lecture-details';
import type { GenerateLectureContentOutput } from '@/lib/types';
import type { SuggestLectureDetailsOutput } from '@/ai/flows/ai-suggest-lecture-details';


function getFriendlyErrorMessage(error: any, defaultMessage: string): string {
    let message = defaultMessage;
    if (error && error.message) {
        message = error.message;
    }
    
    if (message.includes('503') || message.includes('overloaded') || message.includes('Service Unavailable')) {
        return 'The AI model is currently busy or unavailable. Please try again in a few moments.';
    }
    if (message.includes('deadline')) {
        return 'The request to the AI model timed out. This can happen during peak hours. Please try again.';
    }
    return message;
}

export async function getLectureContent(topic: string, duration: number): Promise<{ success: boolean, data?: GenerateLectureContentOutput, error?: string}> {
  try {
    const result = await generateLectureContent({ topic, duration });
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    const errorMessage = getFriendlyErrorMessage(error, 'Failed to generate lecture content.');
    return { success: false, error: errorMessage };
  }
}

export async function getRecordedLecture(script: string) {
  try {
    const result = await generateRecordedLecture({ script });
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    const errorMessage = getFriendlyErrorMessage(error, 'Failed to generate recorded lecture.');
    return { success: false, error: errorMessage };
  }
}

export async function getChatbotResponse(question: string, availableResources: string) {
  try {
    const result = await aiChatbot({ question, availableResources });
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    const errorMessage = getFriendlyErrorMessage(error, 'Failed to get chatbot response.');
    return { success: false, error: errorMessage };
  }
}

export async function getSuggestedLectureDetails(courseTitle: string): Promise<{ success: boolean, data?: SuggestLectureDetailsOutput, error?: string }> {
  try {
    const result = await suggestLectureDetails({ courseTitle });
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    const errorMessage = getFriendlyErrorMessage(error, 'Failed to get lecture suggestions.');
    return { success: false, error: errorMessage };
  }
}
