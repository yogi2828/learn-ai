'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Users, Loader2 } from 'lucide-react';
import type { AttendanceRecord } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/components/user-provider';
import { useRouter } from 'next/navigation';

type GroupedAttendance = {
    [date: string]: AttendanceRecord[];
};

export default function ViewAttendancePage() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const router = useRouter();

    const [groupedRecords, setGroupedRecords] = useState<GroupedAttendance>({});
    const [loading, setLoading] = useState(true);

    const isPrivilegedUser = user?.role === 'teacher' || user?.role === 'admin';

     useEffect(() => {
        if (user && !isPrivilegedUser) {
            router.push('/dashboard');
        }
    }, [user, isPrivilegedUser, router]);

    useEffect(() => {
        if (!isPrivilegedUser) return;
        const attendanceQuery = query(collection(firestore, "attendance"), orderBy("markedAt", "desc"));
        
        const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
            const records: AttendanceRecord[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as AttendanceRecord));

            const grouped = records.reduce((acc, record) => {
                const date = record.date;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(record);
                return acc;
            }, {} as GroupedAttendance);

            setGroupedRecords(grouped);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore, isPrivilegedUser]);

    if (!isPrivilegedUser) {
        return null;
    }

    return (
        <div className="space-y-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">View Attendance</h2>
            <p className="text-muted-foreground">Monitor student attendance records.</p>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>A log of all student attendance marked in the system, grouped by date.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : Object.keys(groupedRecords).length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">No attendance records have been submitted yet.</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(groupedRecords).map(([date, records]) => (
                            <AccordionItem value={date} key={date}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                        <span>{format(new Date(date), 'EEEE, MMMM do, yyyy')}</span>
                                        <span className="text-muted-foreground">{records.length} Student(s) Present</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Time Marked</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {records.map(record => (
                                                <TableRow key={record.id}>
                                                    <TableCell className="font-medium">{record.userName}</TableCell>
                                                    <TableCell>
                                                        {record.markedAt ? format(record.markedAt.toDate(), 'p') : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
        </div>
    );
}
