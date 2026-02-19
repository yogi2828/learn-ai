'use client';
import { useState, useTransition, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLectureContent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Play, StopCircle, Circle } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection, updateDoc, deleteField } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEMO_CLASS_ID = 'ai-demo-class';

export default function AITeacherStudioPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  const [isProcessing, startProcessing] = useTransition();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [statusMessage, setStatusMessage] = useState('Idle');
  const { toast } = useToast();

  const [topic, setTopic] = useState('The Fundamentals of Data Communication and Networking');
  const [duration, setDuration] = useState(15);


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

  const handleStartClass = (e: FormEvent) => {
    e.preventDefault();
    if (!topic) {
        toast({ title: "Topic required", description: "Please enter a topic for the demonstration.", variant: "destructive" });
        return;
    }
    
    startProcessing(async () => {
      try {
        setStatusMessage('Generating lecture script...');
        toast({ title: 'AI Teacher is Preparing...', description: 'Generating lecture script. This may take a moment.' });
        
        const contentResult = await getLectureContent(topic, duration);
        if (!contentResult.success || !contentResult.data) {
          throw new Error(contentResult.error || 'Failed to generate lecture script.');
        }
        
        setStatusMessage('Starting class and notifying students...');
        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: LiveClass = {
            id: DEMO_CLASS_ID,
            status: 'live',
            topic: topic,
            duration: duration,
            title: contentResult.data.title,
            description: "An AI-led demonstration class.",
            script: contentResult.data,
            teacherName: 'AI Teacher',
            updatedAt: serverTimestamp(),
        };
        await setDoc(classRef, classData);

        const announcementData = {
            title: `AI Demo Class is Live: ${topic}`,
            content: `The AI Teacher has started a demonstration class on "${topic}". Join now from the Live Classes page!`,
            authorId: 'system',
            authorName: 'Learnify System',
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'announcements'), announcementData);

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
        
        const updateData = {
            status: 'ended',
            script: deleteField(),
            updatedAt: serverTimestamp(),
        };

        try {
            await updateDoc(classRef, updateData);
            toast({ title: `Demo Class Ended`, description: `The session has been successfully ended.` });
            setStatusMessage('Class ended.');
        } catch (error: any) {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: { status: 'ended' } }, error);
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
                Enter a topic, choose a duration, and click &quot;Start Demonstration&quot;. The AI will generate a lecture script, start a live class, and notify all students.
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>AI Class Demonstration</CardTitle>
                <CardDescription>
                    Use this panel to manage the AI demonstration class.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className={cn(
                    "flex items-center justify-center p-4 rounded-lg",
                    isClassLive ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                    <Circle className={cn('h-4 w-4 mr-3', isClassLive ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500')} />
                    <p className="font-semibold">
                        Demonstration Status: 
                        <span className={cn("ml-1 font-bold", isClassLive ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-400")}>
                             {liveClass?.topic && isClassLive ? `${liveClass.topic} - LIVE` : (isClassLive ? 'LIVE' : 'NOT RUNNING')}
                        </span>
                    </p>
                </div>
                
                {!isClassLive ? (
                    <form onSubmit={handleStartClass} className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="topic">Lecture Topic</Label>
                                <Input 
                                    id="topic" 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="e.g., Introduction to Machine Learning" 
                                    required 
                                    disabled={isProcessing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Select onValueChange={(value) => setDuration(Number(value))} defaultValue={String(duration)} disabled={isProcessing}>
                                    <SelectTrigger id="duration">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-center pt-4">
                            <Button type="submit" size="lg" disabled={isProcessing || !topic}>
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
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
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
                    </div>
                )}
                  
                {isProcessing && <p className="text-sm text-muted-foreground animate-pulse text-center">{statusMessage}</p>}
            </CardContent>
        </Card>

    </div>
  );
}
