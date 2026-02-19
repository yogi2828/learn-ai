'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFirebase } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { LiveClass } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MicOff, Tv } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const classId = 'dsa-live-session';

const ClassroomSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-4">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-40 w-full" />
             <Skeleton className="h-20 w-full" />
        </div>
    </div>
)

export default function LiveClassSessionPage() {
    const { firestore } = useFirebase();
    const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const unsubscribe = onSnapshot(classRef, (doc) => {
            if(doc.exists()) {
                setLiveClass(doc.data() as LiveClass);
            }
            setLoading(false);
        }, (error) => {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'get' }, error);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);


    if(loading) {
        return <ClassroomSkeleton />;
    }

    if (!liveClass || liveClass.status !== 'live' || !liveClass.script || !liveClass.audioUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                 <MicOff className="h-16 w-16 text-destructive" />
                 <h2 className="mt-4 text-2xl font-bold font-headline">The Live Class Has Ended</h2>
                 <p className="text-muted-foreground mt-2">This session is no longer active. You can check for recorded lectures.</p>
                 <Button asChild className="mt-6">
                     <Link href="/dashboard/live-classes">Go Back to Live Classes</Link>
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
                <p className="text-muted-foreground">Presented by your AI Teacher. Estimated Duration: {liveClass.duration} minutes.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Lecture Audio</CardTitle>
                </CardHeader>
                <CardContent>
                    <audio controls autoPlay src={liveClass.audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Lecture Notes & Visuals</CardTitle>
                </CardHeader>
                 <CardContent>
                     <ScrollArea className="h-[50vh]">
                        <article className='prose prose-sm md:prose-base dark:prose-invert max-w-none p-2'>
                            <h2 className='font-headline'>{liveClass.script.title}</h2>
                            <h3>Introduction</h3>
                            <p>{liveClass.script.introduction}</p>
                            {liveClass.script.sections.map((section, index) => (
                                <div key={index}>
                                    <h3>{section.heading}</h3>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                            <h3>Conclusion</h3>
                            <p>{liveClass.script.conclusion}</p>
                        </article>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
