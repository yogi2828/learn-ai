'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { RecordedLecture } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

const LectureSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
    </div>
);

export default function RecordedLecturesPage() {
    const { firestore } = useFirebase();
    const [lectures, setLectures] = useState<RecordedLecture[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, "recordedLectures"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lecturesData: RecordedLecture[] = [];
            querySnapshot.forEach((doc) => {
                lecturesData.push({
                    id: doc.id,
                    ...doc.data()
                } as RecordedLecture);
            });
            setLectures(lecturesData);
            setLoading(false);
        }, () => {
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);


  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Recorded Lectures</h2>
        <p className="text-muted-foreground">Watch recorded sessions anytime to catch up on missed classes or revise topics.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Lecture Library</CardTitle>
            <CardDescription>Browse previously generated AI lectures. New lectures are added when a teacher prepares them for a live class.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <LectureSkeleton />
            ) : lectures.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No recorded lectures are available yet.</p>
                    <p className="mt-1 text-xs text-muted-foreground">Lectures are automatically recorded and saved here whenever a teacher starts a new AI-led class from the 'AI Teacher Studio'.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full">
                    {lectures.map(lecture => (
                        <AccordionItem value={lecture.id} key={lecture.id}>
                             <AccordionTrigger>
                                <div className='flex flex-col items-start text-left'>
                                    <span className='font-semibold'>{lecture.topic}</span>
                                    <span className='text-sm text-muted-foreground font-normal'>
                                        By {lecture.teacherName} on {(lecture.createdAt as any)?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                             </AccordionTrigger>
                             <AccordionContent className="space-y-4">
                                <div>
                                    <h3 className='font-semibold mb-2'>Generated Audio</h3>
                                    <audio controls src={lecture.audioUrl} className='w-full'>
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                                <article className='prose prose-sm md:prose-base dark:prose-invert max-w-none p-4 border rounded-lg bg-muted/50'>
                                    <h2 className='font-headline'>{lecture.script.title}</h2>
                                    <h3>Introduction</h3>
                                    <p>{lecture.script.introduction}</p>
                                    {lecture.script.sections.map((section, index) => (
                                        <div key={index}>
                                            <h3>{section.heading}</h3>
                                            {section.imageUrl && (
                                                <div className="relative aspect-video w-full my-4 rounded-lg overflow-hidden not-prose">
                                                    <Image src={section.imageUrl} alt={section.heading} layout="fill" className="object-contain" />
                                                </div>
                                            )}
                                            <p>{section.content}</p>
                                        </div>
                                    ))}
                                    <h3>Conclusion</h3>
                                    <p>{lecture.script.conclusion}</p>
                                </article>
                             </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
