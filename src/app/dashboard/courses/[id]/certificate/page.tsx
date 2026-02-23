'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@/components/user-provider';
import { mockCourses } from '@/lib/mock-courses';
import type { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Award, Lock } from 'lucide-react';
import jsPDF from 'jspdf';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

function CertificateContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params;
    const { user } = useUser();
    const [course, setCourse] = useState<Course | null>(null);
    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const progress = Number(searchParams.get('progress') ?? 0);
    const isComplete = progress >= 100;

    useEffect(() => {
        const foundCourse = mockCourses.find(c => c.id === id);
        if (foundCourse) {
            setCourse(foundCourse);
        }
    }, [id]);
    
    useEffect(() => {
        const styleId = 'bg-grid-pattern-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
        .bg-grid-pattern {
            background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
            background-size: 20px 20px;
        }`;
        document.head.appendChild(style);

        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
        }
    }, []);

    const handleDownloadPdf = () => {
        if (!user || !course || !isComplete) return;

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'letter',
        });

        const docWidth = doc.internal.pageSize.getWidth();
        const docHeight = doc.internal.pageSize.getHeight();

        // Border
        doc.setDrawColor('#000');
        doc.setLineWidth(2);
        doc.rect(20, 20, docWidth - 40, docHeight - 40);

        // Title
        doc.setFont('times', 'bold');
        doc.setFontSize(40);
        doc.setTextColor('#1E293B'); // slate-800
        doc.text('Certificate of Completion', docWidth / 2, 80, { align: 'center' });

        // Subtitle
        doc.setFontSize(16);
        doc.setFont('times', 'normal');
        doc.text('This certificate is proudly presented to', docWidth / 2, 120, { align: 'center' });

        // Student Name
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5'); // indigo-600
        doc.text(user.name, docWidth / 2, 160, { align: 'center' });

        // Description
        doc.setFontSize(16);
        doc.setFont('times', 'normal');
        doc.setTextColor('#1E293B');
        const description = `for successfully completing the course`;
        doc.text(description, docWidth / 2, 200, { align: 'center' });

        // Course Name
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(`"${course.title}"`, docWidth / 2, 230, { align: 'center' });

        // Signatures
        const signatureY = docHeight - 100;
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.line(docWidth * 0.2, signatureY, docWidth * 0.4, signatureY);
        doc.text('Course Instructor', docWidth * 0.3, signatureY + 15, { align: 'center' });
        doc.text(course.teacher, docWidth * 0.3, signatureY - 8, { align: 'center' });

        doc.line(docWidth * 0.6, signatureY, docWidth * 0.8, signatureY);
        doc.text('Date of Completion', docWidth * 0.7, signatureY + 15, { align: 'center' });
        doc.text(completionDate, docWidth * 0.7, signatureY - 8, { align: 'center' });

        doc.save(`${user.name}-${course.id}-certificate.pdf`);
    };

    if (!user || !course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {!isComplete && (
                <Alert variant="destructive" className="mb-8">
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Course Not Completed</AlertTitle>
                    <AlertDescription>
                        You must complete 100% of the course to unlock and download your certificate.
                        <Button variant="link" asChild className="p-0 h-auto ml-2">
                           <Link href={`/dashboard/courses/${id}`}>Return to Course</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className={cn(
                "bg-card border-2 border-primary/20 shadow-2xl rounded-lg p-8 relative overflow-hidden",
                !isComplete && "blur-md pointer-events-none select-none"
                )}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <Award className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                        <h1 className="text-4xl font-bold font-headline text-foreground">Certificate of Completion</h1>
                        <p className="text-muted-foreground mt-2">This is to certify that</p>
                    </div>

                    <div className="text-center my-8">
                        <h2 className="text-5xl font-bold text-primary font-headline">{user.name}</h2>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-muted-foreground">has successfully completed the course</p>
                        <h3 className="text-3xl font-semibold mt-2">{course.title}</h3>
                    </div>

                    <div className="flex justify-between items-center mt-12 pt-6 border-t">
                        <div className="text-center">
                            <p className="font-semibold">{course.teacher}</p>
                            <p className="text-sm text-muted-foreground">Course Instructor</p>
                        </div>
                        <div className="text-center">
                           <Icons.logo className="h-16 w-16 text-primary mx-auto"/>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">{completionDate}</p>
                            <p className="text-sm text-muted-foreground">Date of Completion</p>
                        </div>
                    </div>
                </div>
            </div>
             {isComplete && (
                <div className="mt-8 text-center">
                    <Button onClick={handleDownloadPdf}>
                        <Download className="mr-2" />
                        Download PDF
                    </Button>
                </div>
             )}
        </div>
    );
}

export default function CertificatePage() {
    return (
        <Suspense fallback={<div>Loading certificate...</div>}>
            <CertificateContent />
        </Suspense>
    )
}
