'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLectureContent, getRecordedLecture } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Power, Video, Circle } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const DEMO_CLASS_ID = 'ai-demo-class';
const DEMO_TOPIC = "The Magic of Neural Networks: From Simple Neurons to Deep Learning";
const DEMO_DURATION = 15; // in minutes

export default function AISuggestionsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  const [isProcessing, startProcessing] = useTransition();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.role === 'student') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (!firestore || !user) return;

    const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
    const unsubscribe = onSnapshot(classRef, (doc) => {
        if (doc.exists()) {
            setLiveClass(doc.data() as LiveClass);
        } else {
             const defaultClassData: Partial<LiveClass> = {
                title: DEMO_TOPIC,
                description: "This is a demonstration of the AI Teacher.",
                status: 'ended',
                teacherName: 'AI Teacher',
            };
            setDoc(classRef, defaultClassData).catch(error => {
                const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'create', requestResourceData: defaultClassData }, error);
                errorEmitter.emit('permission-error', permissionError);
            });
        }
    },
    (error) => {
        const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'get' }, error);
        errorEmitter.emit('permission-error', permissionError);
    });
    return () => unsubscribe();
  }, [firestore, user]);

  if (!user || user.role === 'student') {
    return null;
  }

  const handleStartDemoClass = () => {
    startProcessing(async () => {
      try {
        toast({ title: 'AI Teacher is Preparing...', description: 'Generating lecture script and audio. This may take a moment.' });
        
        const contentResult = await getLectureContent(DEMO_TOPIC, DEMO_DURATION);
        if (!contentResult.success || !contentResult.data) {
          throw new Error(contentResult.error || 'Failed to generate lecture content.');
        }

        const script = [
            `Title: ${contentResult.data.title}`,
            `Introduction: ${contentResult.data.introduction}`,
            ...contentResult.data.sections.map(s => `${s.heading}. ${s.content}`),
            `Conclusion: ${contentResult.data.conclusion}`
        ].join('\n\n');

        const audioResult = await getRecordedLecture(script);
        if (!audioResult.success || !audioResult.data) {
          throw new Error(audioResult.error || 'Failed to generate lecture audio.');
        }

        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: Partial<LiveClass> = {
            status: 'live',
            topic: DEMO_TOPIC,
            duration: DEMO_DURATION,
            title: contentResult.data.title,
            script: contentResult.data,
            audioUrl: audioResult.data.media,
            teacherName: 'AI Teacher',
            updatedAt: serverTimestamp(),
        };
        await setDoc(classRef, classData, { merge: true });

        const announcementData = {
            title: `AI Demo Class is Live: ${DEMO_TOPIC}`,
            content: `The AI Teacher has started a demonstration class. Join now from the Live Classes page!`,
            authorId: 'system',
            authorName: 'Learnify System',
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'announcements'), announcementData);

        const recordedLectureData = {
          topic: DEMO_TOPIC,
          script: contentResult.data,
          audioUrl: audioResult.data.media,
          createdAt: serverTimestamp(),
          teacherName: 'AI Teacher',
        };
        await addDoc(collection(firestore, 'recordedLectures'), recordedLectureData);

        toast({ title: 'AI Demo Class Started!', description: 'Students have been notified.' });

      } catch (error: any) {
         toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleEndDemoClass = () => {
    startProcessing(async () => {
        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: Partial<LiveClass> = {
            status: 'ended',
            script: null,
            audioUrl: null,
            updatedAt: serverTimestamp(),
        };

        try {
            await setDoc(classRef, classData, { merge: true });
            toast({
                title: `Demo Class Ended`,
                description: `The session has been successfully ended.`,
            });
        } catch (error: any) {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Error", description: "Could not end the class session.", variant: 'destructive'});
        }
    });
  }

  const isClassLive = liveClass?.status === 'live';

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Teacher Demonstration</h2>
        <p className="text-muted-foreground">Start a demonstration class conducted by the AI Teacher. Students can join and experience it live.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>AI Class Control</CardTitle>
            <CardDescription>
               Use this control panel to start or stop the AI demonstration class.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                    <Circle className={cn('fill-muted-foreground text-muted-foreground', isClassLive && 'fill-green-500 text-green-500')} />
                    <div>
                        <p className="font-semibold">
                            Demo Status: 
                            <span className={cn("ml-1 font-bold", isClassLive ? "text-green-600" : "text-red-600")}>
                                {isClassLive ? 'LIVE' : 'ENDED'}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">Topic: {DEMO_TOPIC}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button onClick={handleStartDemoClass} className="w-full" disabled={isProcessing || isClassLive}>
                    {isProcessing && !isClassLive ? <Loader2 className="animate-spin mr-2" /> : <Video className="mr-2" />}
                    Start Demo Class
                </Button>
                <Button onClick={handleEndDemoClass} variant="destructive" className="w-full" disabled={isProcessing || !isClassLive}>
                    {isProcessing && isClassLive ? <Loader2 className="animate-spin mr-2" /> : <Power className="mr-2" />}
                    End Demo Class
                </Button>
            </div>
        </CardContent>
    </Card>
    </div>
  );
}
