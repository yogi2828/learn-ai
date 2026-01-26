'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Circle, Clock } from "lucide-react";
import { useFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { LiveClass } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function LiveClassesPage() {
    const { firestore } = useFirebase();
    const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
    const [loading, setLoading] = useState(true);

    const classId = 'dsa-live-session'; // Using a fixed ID for the single class session

    useEffect(() => {
        const classRef = doc(firestore, 'liveClasses', classId);
        const unsubscribe = onSnapshot(classRef, (doc) => {
            if (doc.exists()) {
                setLiveClass({ id: doc.id, ...doc.data() } as LiveClass);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, classId]);
    
    if (loading) {
        return (
             <div className="space-y-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live Classes</h2>
                    <p className="text-muted-foreground">Join your scheduled classes here.</p>
                </div>
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (!liveClass || liveClass.status === 'ended') {
         return (
             <div className="space-y-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live Classes</h2>
                    <p className="text-muted-foreground">Join your scheduled classes here.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>No Live Classes</CardTitle>
                        <CardDescription>There are currently no live or scheduled classes.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const renderClassStatus = () => {
        if (liveClass.status === 'live') {
            return {
                icon: <Circle className="h-4 w-4 fill-green-500 text-green-500" />,
                title: 'Class is live now!',
                description: 'Join the session to participate.',
                joinable: true
            };
        }
        if (liveClass.status === 'scheduled' && liveClass.scheduledAt) {
             return {
                icon: <Clock className="h-4 w-4 text-blue-500" />,
                title: `Scheduled for ${liveClass.scheduledAt.toDate().toLocaleDateString()}`,
                description: `The class will begin at ${liveClass.scheduledAt.toDate().toLocaleTimeString()}.`,
                joinable: false
            };
        }
        return {
            icon: <Circle className="h-4 w-4 fill-muted-foreground text-muted-foreground" />,
            title: 'Class is not in session.',
            description: 'Please wait for the teacher to start the class.',
            joinable: false
        };
    }

    const statusInfo = renderClassStatus();

    return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Live Classes</h2>
            <p className="text-muted-foreground">Join your scheduled classes here.</p>
          </div>
    
          <Card>
            <CardHeader>
                <CardTitle>{liveClass.title}</CardTitle>
                <CardDescription>Taught by {liveClass.teacherName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-6 bg-secondary rounded-lg">
                    <div>
                        <div className='flex items-center gap-2'>
                           {statusInfo.icon}
                            <p className="font-semibold">{statusInfo.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {statusInfo.description}
                        </p>
                    </div>
                    <Button asChild disabled={!statusInfo.joinable}>
                      <Link href="/dashboard/live-classes/session">
                        <Video className="mr-2 h-4 w-4" /> Join Class
                      </Link>
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <p className='text-xs text-muted-foreground'>The "Join Class" button will be active when the teacher starts the session.</p>
            </CardFooter>
          </Card>
    
          <Card>
            <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>No other classes are scheduled for today.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
}
