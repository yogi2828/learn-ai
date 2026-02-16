'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating recorded lectures using AI.
 *
 * The flow takes a topic as input and returns a data URI containing the recorded lecture in WAV format.
 *
 * @module ai/flows/ai-generated-recorded-lectures
 * @exports generateRecordedLecture - An async function that triggers the lecture generation flow.
 * @exports RecordedLectureInput - The input type for the generateRecordedLecture function.
 * @exports RecordedLectureOutput - The output type for the generateRecordedLecture function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import * as wav from 'wav';
import { z } from 'zod';

const RecordedLectureInputSchema = z.object({
  script: z.string(),
});
export type RecordedLectureInput = z.infer<typeof RecordedLectureInputSchema>;

const RecordedLectureOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI."),
});
export type RecordedLectureOutput = z.infer<typeof RecordedLectureOutputSchema>;


/**
 * Generates a recorded lecture for a given topic using an AI model.
 * @param input - The input object containing the topic for the lecture.
 * @returns A promise that resolves to an object containing the recorded lecture as a data URI.
 */
export async function generateRecordedLecture(input: RecordedLectureInput): Promise<RecordedLectureOutput> {
  return generateRecordedLectureFlow(input);
}

const generateRecordedLectureFlow = ai.defineFlow(
  {
    name: 'generateRecordedLectureFlow',
    inputSchema: RecordedLectureInputSchema,
    outputSchema: RecordedLectureOutputSchema,
  },
  async (input: RecordedLectureInput) => {
    // Truncate script to a reasonable length to avoid hitting API limits for TTS
    const MAX_SCRIPT_LENGTH = 4800; // Gemini TTS has a 5000 character limit, this is a safe buffer
    const truncatedScript = input.script.length > MAX_SCRIPT_LENGTH 
      ? input.script.substring(0, MAX_SCRIPT_LENGTH) 
      : input.script;

    if (input.script.length > MAX_SCRIPT_LENGTH) {
      console.warn(`Warning: The lecture script was too long and was truncated to ${MAX_SCRIPT_LENGTH} characters for audio generation.`);
    }

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Hadar' }, // Using a different voice for a better experience
          },
        },
      },
      prompt: truncatedScript,
    });
    if (!media) {
      throw new Error('No audio media was returned from the AI model. The TTS generation failed.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
