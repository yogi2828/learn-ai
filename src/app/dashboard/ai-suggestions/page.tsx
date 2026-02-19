'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLectureContent, getRecordedLecture } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Play, StopCircle, Circle } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DEMO_CLASS_ID = 'ai-demo-class';
const DEMO_LECTURE_TOPIC = "The Fundamentals of Data Communication and Networking";
const DEMO_LECTURE_DURATION = 15;

export default function AITeacherStudioPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  const [isProcessing, startProcessing] = useTransition();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [statusMessage, setStatusMessage] = useState('Idle');
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
        setLiveClass(null);
      }
    }, (error) => {
      const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'get' }, error);
      errorEmitter.emit('permission-error', permissionError);
    });
    return () => unsubscribe();
  }, [firestore, user]);

  if (!user || user.role === 'student') {
    return null;
  }

  const handleStartClass = () => {
    startProcessing(async () => {
      try {
        setStatusMessage('Generating lecture script...');
        toast({ title: 'AI Teacher is Preparing...', description: 'Generating lecture script. This may take a moment.' });
        
        const contentResult = await getLectureContent(DEMO_LECTURE_TOPIC, DEMO_LECTURE_DURATION);
        if (!contentResult.success || !contentResult.data) {
          throw new Error(contentResult.error || 'Failed to generate lecture script.');
        }
        
        setStatusMessage('Generating lecture audio...');
        toast({ title: 'AI Teacher is Preparing...', description: 'Generating lecture audio. This can take up to a minute.' });
        
        const scriptText = [
            `Title: ${contentResult.data.title}`, `Introduction: ${contentResult.data.introduction}`,
            ...contentResult.data.sections.map(s => `${s.heading}. ${s.content}`),
            `Conclusion: ${contentResult.data.conclusion}`
        ].join('\n\n');

        const audioResult = await getRecordedLecture(scriptText);
        if (!audioResult.success || !audioResult.data) {
          throw new Error(audioResult.error || 'Failed to generate lecture audio.');
        }

        setStatusMessage('Starting class and notifying students...');
        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: LiveClass = {
            id: DEMO_CLASS_ID,
            status: 'live',
            topic: DEMO_LECTURE_TOPIC,
            duration: DEMO_LECTURE_DURATION,
            title: contentResult.data.title,
            description: "An AI-led demonstration class.",
            script: contentResult.data,
            audioUrl: audioResult.data.media,
            teacherName: 'AI Teacher',
            updatedAt: serverTimestamp(),
        };
        await setDoc(classRef, classData);

        const announcementData = {
            title: `AI Demo Class is Live: ${DEMO_LECTURE_TOPIC}`,
            content: `The AI Teacher has started a demonstration class on "${DEMO_LECTURE_TOPIC}". Join now from the Live Classes page!`,
            authorId: 'system',
            authorName: 'Learnify System',
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'announcements'), announcementData);

        const recordedLectureData = {
          topic: DEMO_LECTURE_TOPIC,
          script: contentResult.data,
          audioUrl: audioResult.data.media,
          createdAt: serverTimestamp(),
          teacherName: 'AI Teacher',
        };
        await addDoc(collection(firestore, 'recordedLectures'), recordedLectureData);

        toast({ title: 'AI Demo Class Started!', description: 'Students have been notified.' });
        setStatusMessage('Class is live!');

      } catch (error: any) {
         toast({ title: "Demonstration Failed", description: error.message, variant: "destructive" });
         setStatusMessage('Error starting class.');
      }
    });
  };

  const handleEndClass = () => {
    startProcessing(async () => {
        setStatusMessage('Ending class session...');
        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: Partial<LiveClass> = {
            status: 'ended',
            script: undefined,
            audioUrl: undefined,
            updatedAt: serverTimestamp(),
        };

        try {
            await setDoc(classRef, classData, { merge: true });
            toast({ title: `Demo Class Ended`, description: `The session has been successfully ended.` });
            setStatusMessage('Class ended.');
        } catch (error: any) {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Error", description: "Could not end the class session.", variant: 'destructive'});
            setStatusMessage('Error ending class.');
        }
    });
  }

  const isClassLive = liveClass?.status === 'live';

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Teacher Studio</h2>
        <p className="text-muted-foreground">Start or stop a live demonstration of an AI-led class.</p>
      </div>

        <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>How it Works</AlertTitle>
            <AlertDescription>
                Clicking &quot;Start Demonstration&quot; will trigger a multi-step process: the AI generates a full lecture script and audio on a pre-defined topic, starts a live class session, and notifies all students. This may take up to a minute to complete.
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>AI Class Demonstration</CardTitle>
                <CardDescription>
                    Use this panel to manage the AI demonstration class.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <div className={cn(
                    "flex items-center justify-center p-4 rounded-lg",
                    isClassLive ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                    <Circle className={cn('h-4 w-4 mr-3', isClassLive ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500')} />
                    <p className="font-semibold">
                        Demonstration Status: 
                        <span className={cn("ml-1 font-bold", isClassLive ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-400")}>
                            {isClassLive ? 'LIVE' : 'NOT RUNNING'}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  {!isClassLive ? (
                     <Button onClick={handleStartClass} size="lg" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" />
                            {statusMessage}...
                          </>
                        ) : (
                          <>
                           <Play className="mr-2" />
                           Start Demonstration
                          </>
                        )}
                    </Button>
                  ) : (
                    <Button onClick={handleEndClass} variant="destructive" size="lg" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" />
                            {statusMessage}...
                          </>
                        ) : (
                           <>
                             <StopCircle className="mr-2" />
                             End Demonstration
                           </>
                        )}
                    </Button>
                  )}
                  {isProcessing && <p className="text-sm text-muted-foreground animate-pulse">{statusMessage}</p>}
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
