'use client';
import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getLectureContent, getRecordedLecture } from '@/app/actions';
import type { GenerateLectureContentOutput } from '@/ai/flows/ai-suggested-lecture-content';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mic, Bot } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
        </div>
    </div>
)

export function RecordedLectureGenerator() {
  const [topic, setTopic] = useState('');
  const [isPending, startTransition] = useTransition();
  const [lectureContent, setLectureContent] = useState<GenerateLectureContentOutput | null>(null);
  const [lectureAudio, setLectureAudio] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!topic) {
        toast({
            title: "Error",
            description: "Please enter a topic.",
            variant: "destructive",
        });
        return;
    }
    setLectureContent(null);
    setLectureAudio(null);
    startTransition(async () => {
      try {
        const contentResult = await getLectureContent(topic);
        if (!contentResult.success || !contentResult.data) {
          throw new Error(contentResult.error || 'Failed to generate lecture content.');
        }
        setLectureContent(contentResult.data);

        const { title, introduction, sections, conclusion } = contentResult.data;
        const script = [
            `Title: ${title}`,
            `Introduction: ${introduction}`,
            ...sections.map(s => `${s.heading}. ${s.content}`),
            `Conclusion: ${conclusion}`
        ].join('\n\n');

        const audioResult = await getRecordedLecture(script);
        if (audioResult.success && audioResult.data) {
          setLectureAudio(audioResult.data.media);
        } else {
          throw new Error(audioResult.error || 'Failed to generate lecture audio.');
        }
        
        toast({ title: 'Success', description: 'AI lecture has been generated.' });
      } catch (error: any) {
         toast({
            title: "Generation Failed",
            description: error.message,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Recorded Lecture</CardTitle>
        <CardDescription>Enter a topic to generate an AI-powered lecture with both a script and audio narration.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleSubmit} className='flex items-end gap-2'>
            <div className='flex-grow space-y-2'>
                <Label htmlFor="lecture-topic">Topic</Label>
                <Input
                    id="lecture-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The History of Artificial Intelligence"
                    disabled={isPending}
                />
            </div>
            <Button type="submit" disabled={isPending} className='min-w-[180px]'>
                 {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Bot className="mr-2 h-4 w-4" />
                        Generate Lecture
                    </>
                )}
            </Button>
        </form>
        
        {isPending && (
            <div className='pt-4'>
                 <LoadingSkeleton />
            </div>
        )}
        
        {lectureContent && (
            <div className='pt-4 space-y-6'>
                {lectureAudio && (
                    <div>
                        <h3 className='font-semibold mb-2'>Generated Audio</h3>
                        <audio controls src={lectureAudio} className='w-full'>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
                <article className='prose prose-sm md:prose-base dark:prose-invert max-w-none'>
                    <h2 className='font-headline'>{lectureContent.title}</h2>
                    <h3>Introduction</h3>
                    <p>{lectureContent.introduction}</p>
                    {lectureContent.sections.map((section, index) => (
                        <div key={index}>
                            <h3>{section.heading}</h3>
                            <p>{section.content}</p>
                        </div>
                    ))}
                    <h3>Conclusion</h3>
                    <p>{lectureContent.conclusion}</p>
                </article>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
