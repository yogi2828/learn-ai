'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { Course, Module, Lesson } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { BookText, Video, AlertCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockCourses } from '@/lib/mock-courses';
import { Progress } from '@/components/ui/progress';

export default function CourseDetailPage() {
    const params = useParams();
    const { id } = params;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

    useEffect(() => {
        setLoading(true);
        const foundCourse = mockCourses.find(c => c.id === id);

        if (foundCourse) {
            setCourse(foundCourse);
            // Set the first lesson of the first module as default
            if (foundCourse.modules && foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
                const firstLesson = foundCourse.modules[0].lessons[0];
                setSelectedLesson(firstLesson);
                setCompletedLessons(prev => new Set(prev.add(firstLesson.id)));
            }
        } else {
            setError('Course not found.');
        }
        setLoading(false);
    }, [id]);

    const totalLessons = useMemo(() => {
        return course?.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0;
    }, [course]);

    const progress = useMemo(() => {
        if (totalLessons === 0) return 0;
        return Math.round((completedLessons.size / totalLessons) * 100);
    }, [completedLessons, totalLessons]);

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setCompletedLessons(prev => new Set(prev.add(lesson.id)));
    };

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 h-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="mt-4 text-xl font-semibold">An Error Occurred</h2>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/courses">Go Back to Courses</Link>
                </Button>
            </div>
        )
    }
    
    if (!course) return null;

    const renderLessonContent = () => {
        if (!selectedLesson) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-10 h-full bg-muted/50 rounded-lg">
                    <BookText className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Select a lesson to begin.</p>
                </div>
            );
        }

        if (selectedLesson.type === 'video') {
            return (
                <div className="aspect-video w-full">
                    <iframe
                        key={selectedLesson.id}
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${selectedLesson.content}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )
        }

        return (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none p-6 bg-muted/50 rounded-lg h-full">
                <p>{selectedLesson.content}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">{progress}% Complete ({completedLessons.size} of {totalLessons} lessons)</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {course.modules && course.modules.length > 0 ? (
                                <Accordion type="single" collapsible defaultValue={course.modules[0].id} className="w-full">
                                    {course.modules.map(module => (
                                        <AccordionItem value={module.id} key={module.id}>
                                            <AccordionTrigger>{module.title}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col gap-1">
                                                    {module.lessons.map(lesson => (
                                                        <Button
                                                            key={lesson.id}
                                                            variant="ghost"
                                                            className={`justify-start gap-2 ${selectedLesson?.id === lesson.id ? 'bg-accent text-accent-foreground' : ''}`}
                                                            onClick={() => handleSelectLesson(lesson)}
                                                        >
                                                            {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <BookText className="h-4 w-4" />}
                                                            <span>{lesson.title}</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center">No content has been added to this course yet.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Course Certificate</CardTitle>
                            <CardDescription>Complete all lessons to view and download your certificate.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/courses/${course.id}/certificate?progress=${progress}`}>
                                    <Award className="mr-2" />
                                    {progress < 100 ? 'View Certificate Progress' : 'View Your Certificate'}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    {renderLessonContent()}
                </div>
            </div>
        </div>
    );
}
