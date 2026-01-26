'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { useUser } from '@/components/user-provider';
import { doc, getDoc, collection, onSnapshot, setDoc, serverTimestamp, updateDoc, query } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Assignment, Submission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Download, FileText, Info, Loader2, Paperclip, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AssignmentDetailSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    </div>
);

export default function AssignmentDetailPage() {
    const params = useParams();
    const { id: assignmentId } = params;
    const { firestore, storage } = useFirebase();
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Student states
    const [userSubmission, setUserSubmission] = useState<Submission | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [comments, setComments] = useState('');
    const [isSubmitting, startSubmitting] = useTransition();

    // Teacher states
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
    const [isGradingDialogOpen, setGradingDialogOpen] = useState(false);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isUpdatingGrade, startUpdatingGrade] = useTransition();


    useEffect(() => {
        if (!assignmentId || !firestore || !user) return;
        setLoading(true);

        const assignmentRef = doc(firestore, 'assignments', assignmentId as string);
        const unsubAssignment = onSnapshot(assignmentRef, (assignmentSnap) => {
            if (assignmentSnap.exists()) {
                setAssignment({
                    id: assignmentSnap.id,
                    ...assignmentSnap.data(),
                } as Assignment);
            } else {
                setError('Assignment not found.');
            }
            setLoading(false);
        }, (e) => {
            console.error(e);
            setError('Failed to load assignment details.');
            setLoading(false);
        });

        let unsubSubmissions: () => void = () => {};

        if (user.role === 'student') {
            const submissionRef = doc(firestore, `assignments/${assignmentId}/submissions`, user.id);
            unsubSubmissions = onSnapshot(submissionRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserSubmission({ id: docSnap.id, ...docSnap.data()} as Submission);
                } else {
                    setUserSubmission(null);
                }
            });
        }

        if (user.role === 'teacher') {
            const submissionsQuery = query(collection(firestore, `assignments/${assignmentId}/submissions`));
            unsubSubmissions = onSnapshot(submissionsQuery, (querySnap) => {
                const subs: Submission[] = [];
                querySnap.forEach(doc => subs.push({id: doc.id, ...doc.data()} as Submission));
                setSubmissions(subs);
            });
        }


        return () => {
            unsubAssignment();
            unsubSubmissions();
        };

    }, [assignmentId, firestore, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileToUpload(e.target.files[0]);
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileToUpload || !user) {
            toast({ title: 'No file selected', description: 'Please choose a file to submit.', variant: 'destructive' });
            return;
        }

        startSubmitting(async () => {
            try {
                const filePath = `submissions/${assignmentId}/${user.id}/${fileToUpload.name}`;
                const fileStorageRef = storageRef(storage, filePath);
                
                await uploadBytes(fileStorageRef, fileToUpload);
                const downloadUrl = await getDownloadURL(fileStorageRef);
                
                const submissionRef = doc(firestore, `assignments/${assignmentId}/submissions`, user.id);
                
                const submissionData: Omit<Submission, 'id'> = {
                    studentId: user.id,
                    studentName: user.name,
                    submittedAt: serverTimestamp() as any,
                    fileUrl: downloadUrl,
                    fileName: fileToUpload.name,
                    comments: comments,
                    grade: 'Not Graded'
                }
                
                await setDoc(submissionRef, submissionData);

                toast({ title: "Success!", description: "Your assignment has been submitted." });
            } catch (err: any) {
                console.error(err);
                toast({ title: 'Submission Failed', description: 'An error occurred while submitting.', variant: 'destructive' });
            }
        });
    }

    const handleOpenGradeDialog = (submission: Submission) => {
      setGradingSubmission(submission);
      setGrade(submission.grade || '');
      setFeedback(submission.feedback || '');
      setGradingDialogOpen(true);
    };

    const handleGradeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSubmission || !grade) {
            toast({ title: "Validation Error", description: "Please select a grade.", variant: "destructive" });
            return;
        }

        startUpdatingGrade(async () => {
            const submissionRef = doc(firestore, `assignments/${assignmentId}/submissions`, gradingSubmission.id);
            try {
                await updateDoc(submissionRef, { grade, feedback });
                toast({ title: "Grade Submitted!", description: "The student's grade has been updated." });
                setGradingDialogOpen(false);
            } catch (err) {
                console.error("Error submitting grade:", err);
                toast({ title: "Error", description: "Failed to submit grade.", variant: "destructive" });
            }
        });
    };

    if (loading) return <AssignmentDetailSkeleton />;
    if (error) return (
        <div className="flex flex-col items-center justify-center text-center p-10 h-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-xl font-semibold">An Error Occurred</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button asChild className="mt-4"><Link href="/dashboard/assignments">Go Back to Assignments</Link></Button>
        </div>
    );
    if (!assignment) return null;

    return (
        <>
        <div className="space-y-6">
            <div>
                <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assignments
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{assignment.title}</h1>
                <p className="text-muted-foreground">Submit your work or view submission status.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                 <div className="md:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Assignment Instructions</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{assignment.instructions}</p></CardContent>
                    </Card>

                    {user?.role === 'student' && !userSubmission && (
                        <Card>
                             <CardHeader>
                                <CardTitle>Submit Your Work</CardTitle>
                                <CardDescription>Upload your file and add any comments for your teacher.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="submission-file">Upload File</Label>
                                        <Input id="submission-file" type="file" onChange={handleFileChange} required />
                                         <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, ZIP. Max size: 10MB.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="submission-comments">Comments</Label>
                                        <Textarea id="submission-comments" value={comments} onChange={e => setComments(e.target.value)} placeholder="Add any notes for your teacher..." rows={4} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSubmitting || !fileToUpload}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Submit Assignment
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                    
                    {user?.role === 'student' && userSubmission && (
                        <>
                        <Card className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                             <CardHeader>
                                <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2"><CheckCircle /> Submission Details</CardTitle>
                                <CardDescription>You have already submitted this assignment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 rounded-md border bg-background p-3">
                                    <FileText className="h-6 w-6 text-muted-foreground"/>
                                    <div className="flex-1">
                                        <p className="font-semibold">{userSubmission.fileName}</p>
                                        <p className="text-sm text-muted-foreground">Submitted on: {(userSubmission.submittedAt as any)?.toDate().toLocaleString()}</p>
                                    </div>
                                    <Button asChild variant="secondary" size="sm">
                                        <a href={userSubmission.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </a>
                                    </Button>
                                </div>
                                {userSubmission.comments && (
                                    <div>
                                        <h4 className="font-semibold">Your Comments:</h4>
                                        <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md mt-1">{userSubmission.comments}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                         {userSubmission.grade && userSubmission.grade !== 'Not Graded' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Star /> Grade & Feedback</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Your Grade:</h4>
                                        <p className="text-2xl font-bold text-primary">{userSubmission.grade}</p>
                                    </div>
                                    {userSubmission.feedback && (
                                        <div>
                                            <h4 className="font-semibold">Teacher&apos;s Feedback:</h4>
                                            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md mt-1">{userSubmission.feedback}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        </>
                    )}

                     {user?.role === 'teacher' && (
                        <Card>
                             <CardHeader>
                                <CardTitle>Student Submissions</CardTitle>
                                <CardDescription>Review submissions from students for this assignment.</CardDescription>
                            </CardHeader>
                            <CardContent className={submissions.length === 0 ? 'text-center text-muted-foreground p-10' : 'p-0'}>
                               {submissions.length === 0 ? (
                                   <>
                                    <Paperclip className='mx-auto h-10 w-10' />
                                    <p className='mt-4'>No submissions have been made yet.</p>
                                   </>
                               ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Submitted At</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.map(sub => (
                                                <TableRow key={sub.id}>
                                                    <TableCell className="font-medium">{sub.studentName}</TableCell>
                                                    <TableCell>{(sub.submittedAt as any)?.toDate().toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={sub.grade && sub.grade !== 'Not Graded' ? 'default' : 'secondary'}>
                                                            {sub.grade || 'Not Graded'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button asChild variant="ghost" size="sm">
                                                            <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenGradeDialog(sub)}>
                                                            <Star className="mr-2 h-4 w-4" />
                                                            Grade
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                               )}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-3">
                                <Info className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Course</p>
                                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Due Date</p>
                                    <p className="text-sm text-muted-foreground">{assignment.dueDate.toDate().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        <Dialog open={isGradingDialogOpen} onOpenChange={setGradingDialogOpen}>
            <DialogContent>
                <form onSubmit={handleGradeSubmit}>
                    <DialogHeader>
                        <DialogTitle>Grade Submission for {gradingSubmission?.studentName}</DialogTitle>
                        <DialogDescription>Select a grade and provide feedback for this submission.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Select onValueChange={setGrade} defaultValue={grade} required>
                                <SelectTrigger id="grade">
                                    <SelectValue placeholder="Select a grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                    <SelectItem value="F">F</SelectItem>
                                    <SelectItem value="Not Graded">Not Graded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback (optional)</Label>
                            <Textarea id="feedback" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide constructive feedback..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setGradingDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isUpdatingGrade}>
                            {isUpdatingGrade && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Grade
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
