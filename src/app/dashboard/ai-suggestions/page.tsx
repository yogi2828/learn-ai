'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSuggestedLectureDetails, getLectureContent, getRecordedLecture } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Power, Video, Circle, Wand2, BookOpen, Mic } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import type { LiveClass, SuggestLectureDetailsOutput, GenerateLectureContentOutput } from '@/lib/types';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { mockCourses } from '@/lib/mock-courses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEMO_CLASS_ID = 'ai-demo-class';

export default function AITeacherStudioPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  const [isProcessing, startProcessing] = useTransition();
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const { toast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [suggestedDetails, setSuggestedDetails] = useState<SuggestLectureDetailsOutput | null>(null);
  const [lectureContent, setLectureContent] = useState<GenerateLectureContentOutput | null>(null);

  const [uiState, setUiState] = useState<'idle' | 'suggesting' | 'generating' | 'starting' | 'ending'>('idle');

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

  const handleSuggestDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
        toast({title: "Please select a course.", variant: "destructive"});
        return;
    }
    setUiState('suggesting');
    setSuggestedDetails(null);
    setLectureContent(null);

    const courseTitle = mockCourses.find(c => c.id === selectedCourse)?.title || '';
    const result = await getSuggestedLectureDetails(courseTitle);
    if (result.success && result.data) {
        setSuggestedDetails(result.data);
    } else {
        toast({ title: "Suggestion Failed", description: result.error, variant: "destructive" });
    }
    setUiState('idle');
  }

  const handleGenerateContent = async () => {
    if (!suggestedDetails) return;
    setUiState('generating');
    setLectureContent(null);
    const result = await getLectureContent(suggestedDetails.topic, suggestedDetails.duration);
    if (result.success && result.data) {
        setLectureContent(result.data);
    } else {
        toast({ title: "Content Generation Failed", description: result.error, variant: "destructive" });
    }
    setUiState('idle');
  }

  const handleStartClass = () => {
    if (!lectureContent || !suggestedDetails) return;
    setUiState('starting');
    startProcessing(async () => {
      try {
        toast({ title: 'AI Teacher is Preparing...', description: 'Generating lecture script and audio. This may take a moment.' });
        
        const scriptText = [
            `Title: ${lectureContent.title}`, `Introduction: ${lectureContent.introduction}`,
            ...lectureContent.sections.map(s => `${s.heading}. ${s.content}`),
            `Conclusion: ${lectureContent.conclusion}`
        ].join('\n\n');

        const audioResult = await getRecordedLecture(scriptText);
        if (!audioResult.success || !audioResult.data) {
          throw new Error(audioResult.error || 'Failed to generate lecture audio.');
        }

        const classRef = doc(firestore, 'liveClasses', DEMO_CLASS_ID);
        const classData: LiveClass = {
            id: DEMO_CLASS_ID,
            status: 'live',
            topic: suggestedDetails.topic,
            duration: suggestedDetails.duration,
            title: lectureContent.title,
            description: "An AI-led demonstration class.",
            script: lectureContent,
            audioUrl: audioResult.data.media,
            teacherName: 'AI Teacher',
            updatedAt: serverTimestamp(),
        };
        await setDoc(classRef, classData);

        const announcementData = {
            title: `AI Demo Class is Live: ${suggestedDetails.topic}`,
            content: `The AI Teacher has started a demonstration class. Join now from the Live Classes page!`,
            authorId: 'system',
            authorName: 'Learnify System',
createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'announcements'), announcementData);

        const recordedLectureData = {
          topic: suggestedDetails.topic,
          script: lectureContent,
          audioUrl: audioResult.data.media,
          createdAt: serverTimestamp(),
          teacherName: 'AI Teacher',
        };
        await addDoc(collection(firestore, 'recordedLectures'), recordedLectureData);

        toast({ title: 'AI Demo Class Started!', description: 'Students have been notified.' });

      } catch (error: any) {
         toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      } finally {
        setUiState('idle');
      }
    });
  };

  const handleEndClass = () => {
    setUiState('ending');
    startProcessing(async () => {
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
            setLectureContent(null);
            setSuggestedDetails(null);
        } catch (error: any) {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Error", description: "Could not end the class session.", variant: 'destructive'});
        } finally {
            setUiState('idle');
        }
    });
  }

  const isClassLive = liveClass?.status === 'live';
  const isBusy = uiState !== 'idle';

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Teacher Studio</h2>
        <p className="text-muted-foreground">Generate AI-powered lectures and conduct a live demonstration class.</p>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>AI Class Control Panel</CardTitle>
                <CardDescription>
                Use this panel to generate content and manage the AI demonstration class.
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
                            <p className="text-sm text-muted-foreground">Topic: {liveClass?.topic || 'N/A'}</p>
                        </div>
                    </div>
                     <Button onClick={handleEndClass} variant="destructive" size="sm" disabled={isBusy || !isClassLive}>
                        {uiState === 'ending' ? <Loader2 className="animate-spin mr-2" /> : <Power className="mr-2" />}
                        End Class
                    </Button>
                </div>
            </CardContent>
        </Card>

      {!isClassLive && (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Suggest a Topic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSuggestDetails} className="space-y-4">
                            <div>
                                <Label htmlFor="course">Select a Course</Label>
                                <Select onValueChange={setSelectedCourse} value={selectedCourse} required>
                                    <SelectTrigger id="course"><SelectValue placeholder="Select a course..." /></SelectTrigger>
                                    <SelectContent>{mockCourses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full" disabled={isBusy || !selectedCourse}>
                                {uiState === 'suggesting' ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                                Suggest Topic
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {suggestedDetails && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Generate Lecture Script</CardTitle>
                            <CardDescription>Use the suggested topic or edit it below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="p-4 bg-muted rounded-md text-sm font-medium">Topic: &quot;{suggestedDetails.topic}&quot; ({suggestedDetails.duration} mins)</p>
                             <Button onClick={handleGenerateContent} className="w-full" disabled={isBusy}>
                                {uiState === 'generating' ? <Loader2 className="animate-spin mr-2" /> : <BookOpen className="mr-2" />}
                                Generate Full Lecture
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Step 3: Review and Start Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ScrollArea className="h-96 w-full p-4 border rounded-lg bg-muted/50">
                        {uiState === 'generating' && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                        {lectureContent ? (
                             <article className='prose prose-sm dark:prose-invert max-w-none'>
                                <h2 className='font-headline'>{lectureContent.title}</h2>
                                <p>{lectureContent.introduction}</p>
                            </article>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                                <p>Generated lecture script will appear here.</p>
                            </div>
                        )}
                    </ScrollArea>
                    <Button onClick={handleStartClass} className="w-full" disabled={isBusy || !lectureContent}>
                        {uiState === 'starting' ? <Loader2 className="animate-spin mr-2" /> : <Mic className="mr-2" />}
                        Start Live Class
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
