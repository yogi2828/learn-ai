'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/components/user-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Bot, ClipboardList, Users, Loader2, Presentation, Megaphone, Video, ArrowRight } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { collection, getDocs, query, where, collectionGroup } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { mockCourses } from '@/lib/mock-courses';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const WelcomeBanner = ({ name }: { name: string }) => {
  const heroImage = PlaceHolderImages.find(p => p.id === 'auth-background');
  return (
    <Card className="relative overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover opacity-10"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="relative p-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
          Welcome Back, {name}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's a quick overview of your virtual classroom.
        </p>
      </div>
    </Card>
  );
};

const QuickLinkCard = ({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) => (
  <Link href={href} className="group block">
    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
              {icon}
            </div>
            <CardTitle className="font-headline">{title}</CardTitle>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </Link>
);


export default function DashboardPage() {
  const { user } = useUser();

  const studentLinks = [
    { title: "My Courses", description: "View your enrolled courses and start learning.", href: "/dashboard/courses", icon: <BookOpen /> },
    { title: "Live Classes", description: "Join live sessions conducted by your AI teacher.", href: "/dashboard/live-classes", icon: <Presentation /> },
    { title: "AI Chatbot", description: "Get instant help and answers to your questions.", href: "/dashboard/chatbot", icon: <Bot /> },
    { title: "Assignments", description: "Check your upcoming assignments and submit your work.", href: "/dashboard/assignments", icon: <ClipboardList /> },
  ];

  const teacherLinks = [
    { title: "Live AI Class", description: "Generate materials and start a new AI-led class.", href: "/dashboard/ai-suggestions", icon: <Presentation /> },
    { title: "Manage Assignments", description: "Create, view, and grade student assignments.", href: "/dashboard/assignments", icon: <ClipboardList /> },
    { title: "View Attendance", description: "Monitor student attendance records.", href: "/dashboard/view-attendance", icon: <Users /> },
    { title: "Post Announcements", description: "Share updates with all students and faculty.", href: "/dashboard/announcements", icon: <Megaphone /> },
  ];

  const adminLinks = [
    { title: "Manage Users", description: "View, edit, and manage all user accounts and roles.", href: "/dashboard/manage-users", icon: <Users /> },
    { title: "Post Announcements", description: "Create and send announcements to all users.", href: "/dashboard/announcements", icon: <Megaphone /> },
    { title: "Review Courses", description: "Oversee the course catalog available on the platform.", href: "/dashboard/courses", icon: <BookOpen /> },
    { title: "View Attendance", description: "Monitor attendance records across the system.", href: "/dashboard/view-attendance", icon: <Users /> },
  ];

  const getQuickLinks = () => {
    switch (user?.role) {
      case 'student': return studentLinks;
      case 'teacher': return teacherLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <div className="space-y-6">
      <WelcomeBanner name={user?.firstName || 'User'} />
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map(link => (
                <QuickLinkCard key={link.href} {...link} />
            ))}
        </div>
      </div>
    </div>
  );
}
