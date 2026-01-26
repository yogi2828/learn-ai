'use client';
import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getLectureContent } from '@/app/actions';
import type { GenerateLectureContentOutput } from '@/ai/flows/ai-suggested-lecture-content';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
    </div>
)


export function AIContentGenerator() {
  const [topic, setTopic] = useState('');
  const [isPending, startTransition] = useTransition();
  const [lecture, setLecture] = useState<GenerateLectureContentOutput | null>(null);
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
    setLecture(null);
    startTransition(async () => {
      const result = await getLectureContent(topic);
      if (result.success && result.data) {
        setLecture(result.data);
      } else {
        toast({
            title: "Generation Failed",
            description: result.error,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className='md:col-span-1'>
            <Card>
                <CardHeader>
                    <CardTitle>Generate Lecture</CardTitle>
                    <CardDescription>Enter a topic and let AI create structured content for your next class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Introduction to Quantum Mechanics"
                                disabled={isPending}
                            />
                        </div>
                        <Button type="submit" disabled={isPending} className='w-full'>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Bot className="mr-2 h-4 w-4" />
                                    Generate Content
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
        <div className='md:col-span-2'>
            <Card className='min-h-full'>
                <CardHeader>
                     <CardTitle>Generated Content</CardTitle>
                    <CardDescription>The AI-generated lecture content will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isPending && <LoadingSkeleton />}
                    {lecture && (
                        <article className='prose prose-sm md:prose-base dark:prose-invert max-w-none'>
                            <h2 className='font-headline'>{lecture.title}</h2>
                            <h3>Introduction</h3>
                            <p>{lecture.introduction}</p>
                            {lecture.sections.map((section, index) => (
                                <div key={index}>
                                    <h3>{section.heading}</h3>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                            <h3>Conclusion</h3>
                            <p>{lecture.conclusion}</p>
                        </article>
                    )}
                    {!isPending && !lecture && (
                        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg h-full">
                            <Bot className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Your generated lecture will be displayed here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
