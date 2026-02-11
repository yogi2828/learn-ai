'use client';
import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePlus2, Loader2 } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, collectionGroup, where, Timestamp } from 'firebase/firestore';
import type { Assignment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { mockCourses } from '@/lib/mock-courses';
import { Textarea } from '@/components/ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AssignmentsPage() {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
    const [newAssignmentCourse, setNewAssignmentCourse] = useState('');
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState<Date | undefined>();
    const [newAssignmentInstructions, setNewAssignmentInstructions] = useState('');
    
    const [submittedAssignmentIds, setSubmittedAssignmentIds] = useState<Set<string>>(new Set());

    const isTeacher = user?.role === 'teacher';

    useEffect(() => {
        if (!firestore) return;

        const assignmentsQuery = query(collection(firestore, "assignments"), orderBy("createdAt", "desc"));
        const unsubAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
            const assignmentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Assignment));
            setAssignments(assignmentsData);
            setLoading(false);
        }, (error) => {
            const permissionError = new FirestorePermissionError({ path: 'assignments', operation: 'list' }, error);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        let unsubSubmissions: () => void = () => {};
        if (user?.role === 'student') {
            const submissionsQuery = query(
                collectionGroup(firestore, 'submissions'),
                where('studentId', '==', user.id)
            );
            unsubSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
                const ids = new Set<string>();
                snapshot.forEach(doc => {
                    const parentAssignmentPath = doc.ref.parent.parent?.path;
                    if(parentAssignmentPath) {
                        const assignmentId = parentAssignmentPath.split('/').pop();
                        if(assignmentId) ids.add(assignmentId);
                    }
                });
                setSubmittedAssignmentIds(ids);
            }, (error) => {
                const permissionError = new FirestorePermissionError({ path: 'submissions', operation: 'list' }, error);
                errorEmitter.emit('permission-error', permissionError);
            });
        }


        return () => {
            unsubAssignments();
            unsubSubmissions();
        };
    }, [firestore, user]);

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAssignmentTitle || !newAssignmentCourse || !newAssignmentDueDate || !newAssignmentInstructions) {
            toast({ title: "Validation Error", description: "Please fill out all fields.", variant: "destructive" });
            return;
        }

        const course = mockCourses.find(c => c.id === newAssignmentCourse);
        if (!course) {
             toast({ title: "Error", description: "Selected course not found.", variant: "destructive" });
            return;
        }

        startTransition(() => {
            const assignmentData = {
                title: newAssignmentTitle,
                course: course.title,
                courseId: newAssignmentCourse,
                dueDate: Timestamp.fromDate(newAssignmentDueDate),
                createdAt: serverTimestamp(),
                instructions: newAssignmentInstructions,
            };
            addDoc(collection(firestore, 'assignments'), assignmentData).then(() => {
                toast({ title: "Success", description: "Assignment created successfully." });
                setDialogOpen(false);
                // Reset form
                setNewAssignmentTitle('');
                setNewAssignmentCourse('');
                setNewAssignmentDueDate(undefined);
                setNewAssignmentInstructions('');
            }).catch((error) => {
                const permissionError = new FirestorePermissionError({ path: 'assignments', operation: 'create', requestResourceData: assignmentData }, error);
                errorEmitter.emit('permission-error', permissionError);
                toast({ title: "Error", description: "Failed to create assignment.", variant: "destructive" });
            });
        });
    };

    const getStatusInfo = (assignment: Assignment) => {
        if (user?.role === 'student' && submittedAssignmentIds.has(assignment.id)) {
             return { text: 'Submitted', variant: 'default' as const };
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = assignment.dueDate.toDate();

        if (dueDate < today) {
            return { text: 'Overdue', variant: 'destructive' as const };
        }
        return { text: 'Pending', variant: 'secondary' as const };
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
                        {isTeacher ? 'Manage Assignments' : 'Your Assignments'}
                    </h2>
                    <p className="text-muted-foreground">
                        {isTeacher ? 'Create, view, and manage assignments.' : 'View and submit your assignments.'}
                    </p>
                </div>
                {isTeacher && (
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><FilePlus2 className="mr-2" />Create Assignment</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <form onSubmit={handleCreateAssignment}>
                                <DialogHeader>
                                    <DialogTitle>New Assignment</DialogTitle>
                                    <DialogDescription>Fill in the details for the new assignment.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" value={newAssignmentTitle} onChange={e => setNewAssignmentTitle(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="course">Course</Label>
                                            <Select onValueChange={setNewAssignmentCourse} value={newAssignmentCourse} required>
                                                <SelectTrigger id="course">
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockCourses.map(course => (
                                                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input
                                                id="dueDate"
                                                type="date"
                                                value={newAssignmentDueDate ? format(newAssignmentDueDate, 'yyyy-MM-dd') : ''}
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        const dateAsNumber = e.target.valueAsNumber;
                                                        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
                                                        setNewAssignmentDueDate(new Date(dateAsNumber + timezoneOffset));
                                                    } else {
                                                        setNewAssignmentDueDate(undefined);
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="instructions">Instructions</Label>
                                        <Textarea id="instructions" value={newAssignmentInstructions} onChange={e => setNewAssignmentInstructions(e.target.value)} required placeholder="Provide detailed instructions..." rows={5} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <Card>
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-8 w-16" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : assignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No assignments found.</TableCell>
                                    </TableRow>
                                ) : (
                                    assignments.map((assignment) => {
                                        const statusInfo = getStatusInfo(assignment);
                                        const isSubmitted = statusInfo.text === 'Submitted';
                                        return (
                                            <TableRow key={assignment.id}>
                                                <TableCell className="font-medium">{assignment.title}</TableCell>
                                                <TableCell>{assignment.course}</TableCell>
                                                <TableCell>{assignment.dueDate.toDate().toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button asChild variant={isTeacher ? 'ghost' : 'outline'} size="sm">
                                                        <Link href={`/dashboard/assignments/${assignment.id}`}>
                                                            {isTeacher ? 'View Submissions' : (isSubmitted ? 'View Submission' : 'View Assignment')}
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
