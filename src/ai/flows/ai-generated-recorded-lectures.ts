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
import * as wav from 'wav';

export type RecordedLectureInput = {
  script: string;
};

export type RecordedLectureOutput = {
  media: string;
};

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
  },
  async (input: RecordedLectureInput) => {
    const { media } = await ai.generate({
      model: ai.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
      prompt: input.script,
    });
    if (!media) {
      throw new Error('no media returned');
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
