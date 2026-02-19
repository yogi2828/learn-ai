'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useFirebase } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { LiveClass } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MicOff, Play, Pause, StopCircle, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const classId = 'ai-demo-class';

const ClassroomSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full mt-6" />
            </div>
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
);

export default function LiveClassSessionPage() {
    const { firestore } = useFirebase();
    const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
    const [loading, setLoading] = useState(true);
    const aiTeacherAvatar = PlaceHolderImages.find(p => p.id === 'teacher-avatar-1');
    const [sessionJoined, setSessionJoined] = useState(false);
    
    const { toast } = useToast();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
    
    const flatSentences = useMemo(() => {
        if (!liveClass?.script) return [];
        const { title, introduction, sections, conclusion } = liveClass.script;
        const fullText = [
            `Title: ${title}`,
            `Introduction: ${introduction}`,
            ...sections.flatMap(s => [`${s.heading}.`, s.content]),
            `Conclusion: ${conclusion}`
        ].join(' ');
        // Simple sentence split. May not be perfect.
        return fullText.match(/[^.!?]+[.!?]+/g) || [];
    }, [liveClass?.script]);

    const stopSpeech = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentSentenceIndex(-1);
        }
    }, []);
    
    const speakSentence = useCallback((index: number) => {
        if (typeof window === 'undefined' || index >= flatSentences.length) {
            stopSpeech();
            return;
        }
        
        const sentence = flatSentences[index];
        const utterance = new SpeechSynthesisUtterance(sentence);
        
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
            setCurrentSentenceIndex(index);
        };

        utterance.onend = () => {
            if (window.speechSynthesis.speaking === false) { // Ensure it wasn't cancelled
                if (index + 1 < flatSentences.length) {
                    speakSentence(index + 1);
                } else {
                    stopSpeech();
                }
            }
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event.error);
            toast({
                title: "Speech Error",
                description: "Could not play lecture audio. Your browser might not support this feature or may require you to enable it.",
                variant: "destructive"
            });
            stopSpeech();
        };
        
        window.speechSynthesis.speak(utterance);
    }, [flatSentences, stopSpeech, toast]);

    const handlePlay = useCallback(() => {
        if (typeof window !== 'undefined') {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
                setIsSpeaking(true);
            } else {
                // Start from the beginning or from where it was stopped
                speakSentence(currentSentenceIndex >= 0 ? currentSentenceIndex : 0);
            }
        }
    }, [isPaused, speakSentence, currentSentenceIndex]);

    const handlePause = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false);
        }
    }, []);

    useEffect(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const unsubscribe = onSnapshot(classRef, (doc) => {
            if (doc.exists()) {
                const classData = doc.data() as LiveClass;
                if (classData.status !== 'live') {
                    setSessionJoined(false);
                    stopSpeech();
                }
                setLiveClass(classData);
            } else {
                setLiveClass(null);
                setSessionJoined(false);
                stopSpeech();
            }
            setLoading(false);
        }, (error) => {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'get' }, error);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        // Cleanup speech on component unmount
        return () => {
            unsubscribe();
            stopSpeech();
        };
    }, [firestore, stopSpeech]);
    
    useEffect(() => {
        if (isSpeaking && currentSentenceIndex !== -1) {
            const activeElement = document.getElementById(`sentence-${currentSentenceIndex}`);
            activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentSentenceIndex, isSpeaking]);

    const handleJoinSession = () => {
        setSessionJoined(true);
    };

    if(loading) {
        return <ClassroomSkeleton />;
    }

    if (!liveClass || liveClass.status !== 'live' || !liveClass.script) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                 <MicOff className="h-16 w-16 text-destructive" />
                 <h2 className="mt-4 text-2xl font-bold font-headline">The Live Class Has Ended</h2>
                 <p className="text-muted-foreground mt-2">This session is no longer active. The next class will be announced by your teacher.</p>
                 <Button asChild className="mt-6">
                     <Link href="/dashboard/live-classes">Go Back to Live Classes</Link>
                 </Button>
            </div>
        )
    }
    
    if (!sessionJoined) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <PlayCircle className="h-16 w-16 text-primary" />
                <h2 className="mt-4 text-2xl font-bold font-headline">Ready to Join the AI Lecture?</h2>
                <p className="text-muted-foreground mt-2">Topic: {liveClass.topic}</p>
                <Button onClick={handleJoinSession} className="mt-6" size="lg">
                    Join Session
                </Button>
            </div>
        )
    }
    
    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    LIVE
                </p>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
                    {liveClass.topic || 'Live AI Lecture'}
                </h1>
                <p className="text-muted-foreground">Presented by your {liveClass.teacherName}. Estimated Duration: {liveClass.duration} minutes.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6 sticky top-20">
                     <Card className="overflow-hidden">
                        <CardHeader className="text-center p-6">
                            {aiTeacherAvatar && (
                                <Avatar className="h-32 w-32 mx-auto animate-bob shadow-lg border-4 border-primary/20">
                                    <AvatarImage src={aiTeacherAvatar.imageUrl} alt="AI Teacher" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            )}
                            <CardTitle className="font-headline mt-4">{liveClass.teacherName}</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-muted/50 p-4 text-center">
                           <p className="text-sm font-medium text-muted-foreground animate-pulse">TEACHING NOW...</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Lecture Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center gap-4">
                            {!isSpeaking && !isPaused ? (
                                <Button onClick={handlePlay}>
                                    <Play className="mr-2" /> Play
                                </Button>
                            ) : isPaused ? (
                                <Button onClick={handlePlay}>
                                    <Play className="mr-2" /> Resume
                                </Button>
                            ) : (
                                <Button onClick={handlePause} variant="secondary">
                                    <Pause className="mr-2" /> Pause
                                </Button>
                            )}
                            <Button onClick={stopSpeech} variant="destructive" disabled={!isSpeaking && !isPaused}>
                                <StopCircle className="mr-2" /> Stop
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lecture Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-20rem)]" >
                                <div className='prose prose-sm md:prose-base dark:prose-invert max-w-none p-2 text-base leading-relaxed'>
                                    <p>
                                        {flatSentences.map((sentence, index) => (
                                            <span key={index} id={`sentence-${index}`} className={index === currentSentenceIndex ? "bg-primary/20 transition-colors duration-300 rounded" : "transition-colors duration-300"}>
                                                {sentence}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
