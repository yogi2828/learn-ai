'use client';
import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2, PartyPopper } from "lucide-react";
import { useUser } from '@/components/user-provider';
import { useFirebase } from '@/firebase';
import { addDoc, collection, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AttendancePage() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const todayDateString = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user || !firestore) return;
    setLoading(true);
    const attendanceQuery = query(
      collection(firestore, 'attendance'),
      where('userId', '==', user.id),
      where('date', '==', todayDateString)
    );

    const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
      setIsMarked(!snapshot.empty);
      setLoading(false);
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: 'attendance', operation: 'list' }, error);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore, todayDateString]);

  const handleMarkAttendance = () => {
    if (!user) return;
    startTransition(() => {
        const attendanceData = {
          userId: user.id,
          userName: user.name,
          date: todayDateString,
          markedAt: serverTimestamp(),
        };
        addDoc(collection(firestore, 'attendance'), attendanceData).then(() => {
            toast({
              title: "Attendance Marked!",
              description: "Your attendance for today has been recorded successfully.",
            });
        }).catch((error: any) => {
            const permissionError = new FirestorePermissionError({ path: 'attendance', operation: 'create', requestResourceData: attendanceData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({
              title: "Error",
              description: error.message || "Failed to mark attendance.",
              variant: "destructive",
            });
        });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">Mark your attendance for today's classes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Mark Today's Attendance</CardTitle>
          <CardDescription>
            Today is {format(new Date(), 'EEEE, MMMM do, yyyy')}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center space-y-4">
          {loading ? (
             <Skeleton className="h-24 w-full" />
          ) : isMarked ? (
             <>
                <PartyPopper className="mx-auto h-12 w-12 text-green-500" />
                <p className="font-semibold text-lg">Attendance Already Marked!</p>
                <p className="text-muted-foreground">You have successfully marked your attendance for today. Great job!</p>
                <Button disabled>Marked Present</Button>
            </>
          ) : (
             <>
                <UserCheck className="mx-auto h-12 w-12 text-primary" />
                 <p className="font-semibold text-lg">Ready to mark your attendance?</p>
                 <p className="text-muted-foreground">Click the button below to confirm you are present today.</p>
                <Button onClick={handleMarkAttendance} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark Present
                </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
