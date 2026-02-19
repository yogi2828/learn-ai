'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Circle } from "lucide-react";
import { useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function LiveClassesPage() {
    const { firestore } = useFirebase();
    const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
    const [loading, setLoading] = useState(true);

    const classId = 'ai-demo-class'; // Pointing to the new demo class ID

    useEffect(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const unsubscribe = onSnapshot(classRef, (doc) => {
            if (doc.exists()) {
                setLiveClass({ id: doc.id, ...doc.data() } as LiveClass);
            }
            setLoading(false);
        }, (error) => {
            const permissionError = new FirestorePermissionError({ path: classRef.path, operation: 'get' }, error);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, classId]);
    
    if (loading) {
        return (
             <div className="space-y-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live AI Class</h2>
                    <p className="text-muted-foreground">Join the live AI demonstration class here.</p>
                </div>
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (!liveClass || liveClass.status !== 'live') {
         return (
             <div className="space-y-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live AI Class</h2>
                    <p className="text-muted-foreground">Join the live AI demonstration class here.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>No Live Class</CardTitle>
                        <CardDescription>The AI demonstration class is not currently running. Please ask a teacher to start it.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live AI Class</h2>
            <p className="text-muted-foreground">Join the live AI demonstration class here.</p>
          </div>
    
          <Card>
            <CardHeader>
                <CardTitle>{liveClass.title}</CardTitle>
                <CardDescription>Presented by: {liveClass.teacherName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-6 bg-secondary rounded-lg">
                    <div className='flex items-center gap-2'>
                       <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                        <p className="font-semibold">Class is live now!</p>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/live-classes/session">
                        <Video className="mr-2 h-4 w-4" /> Join Class
                      </Link>
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      );
}
