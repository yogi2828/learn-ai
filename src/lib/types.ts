import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export type GenerateLectureContentInput = {
  topic: string;
  duration?: number;
};

export type GenerateLectureContentOutput = {
  title: string;
  introduction: string;
  sections: Array<{
    heading: string;
    content: string;
    imageUrl?: string;
  }>;
  conclusion: string;
};

export const SuggestLectureDetailsInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course for which to suggest a lecture.'),
});
export type SuggestLectureDetailsInput = z.infer<typeof SuggestLectureDetailsInputSchema>;

export const SuggestLectureDetailsOutputSchema = z.object({
  topic: z.string().describe('A specific, engaging lecture topic suitable for the course. Should be a single-line title.'),
  duration: z.nativeEnum([15, 30, 45, 60]).describe('The suggested duration for the lecture in minutes.'),
});
export type SuggestLectureDetailsOutput = z.infer<typeof SuggestLectureDetailsOutputSchema>;

export type Lesson = {
  id: string;
  title: string;
  type: 'video' | 'text';
  content: string; // youtube video ID or markdown text
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  teacher: string;
  imageId: string;
  modules?: Module[];
};

export type Assignment = {
  id: string;
  title: string;
  course: string;
  courseId: string;
  dueDate: Timestamp;
  createdAt: Timestamp;
  instructions: string;
};

export type Submission = {
  id: string; // student id
  studentId: string;
  studentName: string;
  submittedAt: Timestamp;
  submissionContent: string;
  comments: string;
  grade?: string;
  feedback?: string;
};

export type Announcement = {
  id:string;
  title: string;
  content: string;
  date: string;
  createdAt: Timestamp;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'student' | 'teacher' | 'admin';
  state: string;
  avatarUrl?: string;
};

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export type ChatSession = {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
};

export type LiveClass = {
    id: string;
    title: string;
    description: string;
    status: 'waiting' | 'live' | 'ended' | 'scheduled';
    teacherName: string;
    topic?: string;
    duration?: number;
    script?: GenerateLectureContentOutput;
    audioUrl?: string;
    scheduledAt?: Timestamp;
}

export type RecordedLecture = {
  id: string;
  topic: string;
  script: GenerateLectureContentOutput;
  audioUrl: string;
  createdAt: Timestamp;
  teacherName: string;
};

export type AttendanceRecord = {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  markedAt: Timestamp;
};
