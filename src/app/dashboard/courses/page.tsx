'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/components/user-provider';
import Link from 'next/link';
import { mockCourses } from '@/lib/mock-courses';
import type { Course } from '@/lib/types';

export default function CoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const isPrivilegedUser = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    // Using mock courses instead of fetching from Firestore
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
            {isPrivilegedUser ? 'Manage Courses' : 'My Courses'}
          </h2>
          <p className="text-muted-foreground">
            {isPrivilegedUser ? 'Review the pre-built courses available to students.' : 'Here are all the courses you are currently enrolled in.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : courses.length === 0 ? (
           <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-10 text-center text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12" />
              <p className="mt-4">No courses available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => {
            const courseImage = PlaceHolderImages.find((p) => p.id === course.imageId);
            return (
              <Card key={course.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                {courseImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={courseImage.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                      data-ai-hint={courseImage.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline">{course.title}</CardTitle>
                  <CardDescription>
                    Taught by <span className="font-medium text-foreground">{course.teacher}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      Go to Course <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
