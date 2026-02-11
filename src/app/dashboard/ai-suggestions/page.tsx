'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getLectureContent, getRecordedLecture, getSuggestedLectureDetails } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Power, Video, Circle, BellPlus, XCircle, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, addDoc, collection, Timestamp } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { mockCourses } from '@/lib/mock-courses';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const classId = 'dsa-live-session';

export default function AISuggestionsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { firestore } = useFirebase();
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');

  const [isProcessing, startProcessing] = useTransition();
  const [isSuggesting, startSuggesting] = useTransition();
  
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
            if (classData.status === 'ended') {
              setTopic('');
              setDuration(30);
              setSelectedCourse('');
              setScheduledDate(undefined);
              setScheduledTime('');
            }
        } else {
             const defaultClassData: Partial<LiveClass> = {
                title: "AI Teacher Session",
                description: "This is a session conducted by the AI Teacher.",
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

  const handleSuggestDetails = () => {
    if (!selectedCourse) {
      toast({ title: "Error", description: "Please select a course first.", variant: "destructive" });
      return;
    }
    const course = mockCourses.find(c => c.id === selectedCourse);
    if (!course) {
       toast({ title: "Error", description: "Could not find selected course.", variant: "destructive" });
       return;
    }

    startSuggesting(async () => {
      const result = await getSuggestedLectureDetails(course.title);
      if (result.success && result.data) {
        setTopic(result.data.topic);
        setDuration(result.data.duration);
        toast({ title: "Details Suggested!", description: "The AI has suggested a topic and duration." });
      } else {
        toast({ title: "Suggestion Failed", description: result.error, variant: "destructive" });
      }
    });
  }

  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
        toast({ title: "Error", description: "Please provide a topic for the class.", variant: "destructive" });
        return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast({ title: "Error", description: "Please select a date and time for the class.", variant: "destructive" });
      return;
    }

    startProcessing(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const finalScheduleDate = new Date(scheduledDate);
        finalScheduleDate.setHours(hours, minutes, 0, 0);

        const classData: Partial<LiveClass> = {
            status: 'scheduled',
            topic: topic,
            duration: duration,
            scheduledAt: Timestamp.fromDate(finalScheduleDate),
            updatedAt: serverTimestamp(),
            teacherName: user.name,
            title: topic,
            description: `An AI-led session by ${user.name}.`,
            script: null,
            audioUrl: null,
        };

        setDoc(classRef, classData, { merge: true }).then(() => {
            const announcementData = {
                title: `New AI Class Scheduled: ${topic}`,
                content: `An AI-led class on "${topic}" has been scheduled by ${user.name} for ${finalScheduleDate.toLocaleString()}. Please check the Live Classes page to join when it starts.`,
                authorId: 'system',
                authorName: 'Learnify System',
                createdAt: serverTimestamp(),
            };
            addDoc(collection(firestore, 'announcements'), announcementData).catch(error => {
                console.error("Failed to post announcement", error);
            });

             toast({ title: "Class Scheduled!", description: "Students will be notified. You can start it manually from this page." });
        }).catch(error => {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Scheduling Failed", description: error.message, variant: "destructive" });
        });
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

        const classRef = doc(firestore, 'liveClasses', classId);
        const classData = {
            status: 'live',
            script: contentResult.data,
            audioUrl: audioResult.data.media,
            updatedAt: serverTimestamp(),
        };
        await setDoc(classRef, classData, { merge: true })
            .catch(error => {
                const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
                errorEmitter.emit('permission-error', permissionError);
                throw error;
            });


        // Save a copy to the recorded lectures collection
        const recordedLectureData = {
          topic: topic,
          script: contentResult.data,
          audioUrl: audioResult.data.media,
          createdAt: serverTimestamp(),
          teacherName: user.name,
        };
        await addDoc(collection(firestore, 'recordedLectures'), recordedLectureData)
            .catch(error => {
                 console.error("Failed to save recorded lecture", error);
                 // Don't throw, main action succeeded
            });

        toast({ title: 'Class Started!', description: 'The session is live and a copy has been saved to Recorded Lectures.' });

      } catch (error: any) {
         toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleEndOrCancelClass = async () => {
    if (!liveClass) return;

    startProcessing(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const action = liveClass.status === 'live' ? 'Ended' : 'Canceled';
        const classData = {
            status: 'ended',
            topic: '',
            script: null,
            audioUrl: null,
            duration: 30,
            scheduledAt: null,
            updatedAt: serverTimestamp(),
        };

        setDoc(classRef, classData, { merge: true }).then(() => {
            setTopic('');
            setSelectedCourse('');
            setScheduledDate(undefined);
            setScheduledTime('');
            
            toast({
                title: `Class ${action}`,
                description: `The session has been successfully ${action.toLowerCase()}.`,
            });
        }).catch(error => {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'update', requestResourceData: classData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Error", description: "Could not end or cancel the class session.", variant: 'destructive'});
        });
    });
  }

  const isClassLive = liveClass?.status === 'live';
  const isClassScheduled = liveClass?.status === 'scheduled';
  const isClassEnded = !isClassLive && !isClassScheduled;

  const renderClassStatus = () => {
    let statusText = 'ENDED';
    let description = 'No class is currently active or scheduled.';

    if (isClassLive) {
        statusText = 'LIVE';
        description = `Topic: ${liveClass?.topic}`;
    } else if (isClassScheduled) {
        statusText = 'SCHEDULED';
        description = `Scheduled Topic: ${liveClass?.topic}`;
    }

    return (
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
                 <Circle className={cn('fill-muted-foreground text-muted-foreground', isClassLive && 'fill-green-500 text-green-500', isClassScheduled && 'fill-blue-500 text-blue-500')} />
                <div>
                    <p className="font-semibold">
                        Current Status: 
                        <span className={cn("ml-1 font-bold", isClassLive ? "text-green-600" : isClassScheduled ? "text-blue-600" : "text-red-600")}>
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

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    if (hour > 19) return null; // Limit to 7:30 PM
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }).filter(Boolean) as string[];


  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Teacher Studio</h2>
        <p className="text-muted-foreground">When you are absent, let the AI Teacher take over. Schedule a topic and the system will handle the rest.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Schedule a New AI Class</CardTitle>
            <CardDescription>
               {isClassEnded ? "Select a course and let the AI suggest lecture details, then schedule the class." : "A class is already scheduled or live. Please end/cancel it before creating a new one."}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <form onSubmit={handleScheduleClass} className='space-y-4'>
                <div className="space-y-2">
                  <Label htmlFor="course-select">Course</Label>
                   <Select
                      value={selectedCourse}
                      onValueChange={setSelectedCourse}
                      disabled={isProcessing || !isClassEnded}
                  >
                      <SelectTrigger id="course-select" className="w-full">
                          <SelectValue placeholder="Select a course to get suggestions" />
                      </SelectTrigger>
                      <SelectContent>
                          {mockCourses.map(course => (
                              <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" onClick={handleSuggestDetails} disabled={isSuggesting || !selectedCourse || !isClassEnded}>
                  {isSuggesting ? <><Loader2 className="mr-2 animate-spin" />Suggesting...</> : <><Sparkles className="mr-2" />Suggest Details</>}
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Suggested Topic</Label>
                        <Input
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="AI will suggest a topic here"
                            disabled={isProcessing || !isClassEnded}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Suggested Duration</Label>
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
                </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Schedule Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !scheduledDate && "text-muted-foreground"
                                )}
                                disabled={!isClassEnded}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Schedule Time</Label>
                        <Select onValueChange={setScheduledTime} value={scheduledTime} disabled={!isClassEnded}>
                            <SelectTrigger id="time">
                                <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map(slot => (
                                    <SelectItem key={slot} value={slot}>{format(new Date(`1970-01-01T${slot}`), 'p')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <Button type="submit" disabled={isProcessing || !isClassEnded || !topic} className='w-full sm:w-auto'>
                    {isProcessing ? <><Loader2 className="mr-2 animate-spin" />Scheduling...</> : <><BellPlus className="mr-2" />Schedule Class</>}
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
