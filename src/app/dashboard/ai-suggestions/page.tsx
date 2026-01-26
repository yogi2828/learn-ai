'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getLectureContent, getRecordedLecture } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Power, Video, Circle, CalendarIcon, BellPlus, XCircle } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection, Timestamp } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


const classId = 'dsa-live-session';

export default function AISuggestionsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

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

    const classRef = doc(firestore, 'liveClasses', classId);
    const unsubscribe = onSnapshot(classRef, (doc) => {
        if (doc.exists()) {
            const classData = doc.data() as LiveClass;
            setLiveClass(classData);
            setTopic(classData.topic || '');
            setDuration(classData.duration || 30);
        } else {
             const defaultClassData: Partial<LiveClass> = {
                title: "Data Structures & Algorithms",
                description: "Join the live session to learn about fundamental data structures.",
                status: 'ended',
                teacherName: user?.name || 'Teacher',
            };
            setDoc(classRef, defaultClassData);
        }
    });
    return () => unsubscribe();
  }, [firestore, user]);

  if (!user || user.role === 'student') {
    return null;
  }

  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !scheduledDate) {
        toast({ title: "Error", description: "Please provide topics and a schedule date/time.", variant: "destructive" });
        return;
    }

    startProcessing(async () => {
        const classRef = doc(firestore, 'liveClasses', classId);
        try {
            await setDoc(classRef, {
                status: 'scheduled',
                topic: topic,
                duration: duration,
                scheduledAt: Timestamp.fromDate(scheduledDate),
                updatedAt: serverTimestamp(),
                teacherName: user.name,
                title: "Data Structures & Algorithms",
                description: "Join the live session to learn about fundamental data structures.",
                script: null,
                audioUrl: null,
            }, { merge: true });

             toast({ title: "Class Scheduled!", description: "The class has been scheduled. You can start it manually from this page." });
        } catch (error: any) {
            toast({ title: "Scheduling Failed", description: error.message, variant: "destructive" });
        }
    });
  }

  const handleStartLiveClass = () => {
    if (!liveClass || !liveClass.topic || !liveClass.duration) return;
    const { topic, duration } = liveClass;

    startProcessing(async () => {
      try {
        toast({ title: 'AI Teacher is Preparing', description: 'Generating lecture script and visuals... This may take a moment.' });
        const contentResult = await getLectureContent(topic, duration);
        if (!contentResult.success || !contentResult.data) {
          throw new Error(contentResult.error || 'Failed to generate lecture content.');
        }

        toast({ title: 'Almost Ready', description: 'Generating lecture audio...' });
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

        toast({ title: 'Starting Class!', description: 'The live session is now beginning for students.' });
        const classRef = doc(firestore, 'liveClasses', classId);
        await setDoc(classRef, {
            status: 'live',
            script: contentResult.data,
            audioUrl: audioResult.data.media,
            updatedAt: serverTimestamp(),
        }, { merge: true });

        // Save a copy to the recorded lectures collection
        await addDoc(collection(firestore, 'recordedLectures'), {
          topic: topic,
          script: contentResult.data,
          audioUrl: audioResult.data.media,
          createdAt: serverTimestamp(),
          teacherName: user.name,
        });

      } catch (error: any) {
         toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleEndOrCancelClass = async () => {
    if (!liveClass) return;

    startProcessing(async () => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const action = liveClass.status === 'live' ? 'Ended' : 'Canceled';
        try {
            await setDoc(classRef, {
                status: 'ended',
                topic: '',
                script: null,
                audioUrl: null,
                duration: null,
                scheduledAt: null,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            
            setTopic('');
            setScheduledDate(undefined);
            
            toast({
                title: `Class ${action}`,
                description: `The session has been successfully ${action.toLowerCase()}.`,
            });
        } catch (error) {
            toast({ title: "Error", description: "Could not end or cancel the class session.", variant: 'destructive'});
        }
    });
  }

  const isClassLive = liveClass?.status === 'live';
  const isClassScheduled = liveClass?.status === 'scheduled';
  const isClassEnded = !isClassLive && !isClassScheduled;

  const renderClassStatus = () => {
    let statusText = 'ENDED';
    let statusColor = 'text-red-600';
    let description = 'No class is currently active or scheduled.';

    if (isClassLive) {
        statusText = 'LIVE';
        statusColor = 'text-green-600';
        description = `Topic: ${liveClass?.topic}`;
    } else if (isClassScheduled) {
        statusText = 'SCHEDULED';
        statusColor = 'text-blue-600';
        description = `Scheduled for: ${liveClass?.scheduledAt?.toDate().toLocaleString()}`;
    }

    return (
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
                 <Circle className={cn('fill-muted-foreground text-muted-foreground', isClassLive && 'fill-green-500 text-green-500', isClassScheduled && 'fill-blue-500 text-blue-500')} />
                <div>
                    <p className="font-semibold">
                        Current Status: 
                        <span className={cn("ml-1 font-bold", statusColor)}>
                            {statusText}
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            {isClassScheduled && (
                 <Button onClick={handleStartLiveClass} variant="default" className="w-40" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Video className="mr-2" /> Start Now</>}
                </Button>
            )}
            {(isClassLive || isClassScheduled) && (
                <Button onClick={handleEndOrCancelClass} variant="destructive" className="w-40" disabled={isProcessing}>
                    {isProcessing && liveClass?.status !== 'scheduled' ? <Loader2 className="animate-spin" /> : isClassLive ? <><Power className="mr-2" /> End Class</> : <><XCircle className="mr-2" /> Cancel</>}
                </Button>
            )}
        </div>
    )
  }


  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live AI Class Studio</h2>
        <p className="text-muted-foreground">Automate your lectures. Enter topics, schedule a time, and let the AI Teacher take over.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Schedule a New Class</CardTitle>
            <CardDescription>
               {isClassEnded ? "Enter lecture details to schedule a new class." : "A class is already scheduled or live. Please end/cancel it before creating a new one."}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <form onSubmit={handleScheduleClass} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor="topic">Topics (one per line)</Label>
                    <Textarea
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Intro to Big O Notation&#10;Array vs. Linked List&#10;Stack and Queue Applications"
                        rows={4}
                        disabled={isProcessing || !isClassEnded}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Approximate Duration</Label>
                         <Select
                            value={duration.toString()}
                            onValueChange={(val) => setDuration(parseInt(val, 10))}
                            disabled={isProcessing || !isClassEnded}
                        >
                            <SelectTrigger id="duration" className="w-full">
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
                     <div className="space-y-2">
                        <Label htmlFor="schedule-date">Schedule Date & Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}
                                     disabled={isProcessing || !isClassEnded}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {scheduledDate ? format(scheduledDate, "PPP p") : <span>Pick a date and time</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                                <div className='p-2 border-t'>
                                    <Label className="text-sm">Time</Label>
                                    <Input type="time" onChange={e => {
                                        const [hours, minutes] = e.target.value.split(':');
                                        setScheduledDate(prev => {
                                            const newDate = prev ? new Date(prev) : new Date();
                                            newDate.setHours(parseInt(hours), parseInt(minutes));
                                            return newDate;
                                        });
                                    }} />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Button type="submit" disabled={isProcessing || !isClassEnded} className='w-full sm:w-auto'>
                    {isProcessing ? <><Loader2 className="mr-2 animate-spin" />Working...</> : <><BellPlus className="mr-2" />Schedule Class</>}
                </Button>
            </form>

            <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-2">Class Control</h3>
                {renderClassStatus()}
            </div>
        </CardContent>
    </Card>
    </div>
  );
}
