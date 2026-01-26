'use client';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { useUser } from '@/components/user-provider';
import { ArrowRight, Bot, CheckCircle, Video } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "AI-Powered Teacher",
        description: "Engage with an intelligent AI that conducts classes, answers doubts, and provides personalized feedback."
    },
    {
        icon: <Video className="h-8 w-8 text-primary" />,
        title: "Live & Recorded Lectures",
        description: "Join live classes or watch recorded sessions at your own pace. Never miss a lecture again."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Automated Attendance",
        description: "Our smart face recognition system marks your attendance automatically, saving you time and effort."
    }
];

const testimonials = [
    {
        name: "Priya Sharma",
        role: "BCA Student",
        avatarId: "student-avatar-2",
        quote: "LearnAI has transformed the way I study. The AI teacher is incredibly helpful for clarifying complex topics, and I love being able to re-watch lectures whenever I need to."
    },
    {
        name: "Arjun Mehta",
        role: "BCA Student",
        avatarId: "student-avatar-1",
        quote: "The automated attendance is a game-changer! No more worrying about marking myself present. The whole platform is so intuitive and makes online learning actually enjoyable."
    }
]

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-classroom');
  const { user, loading } = useUser();
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Icons.logo className="h-8 w-8" />
              <span className="font-headline">LearnAI</span>
            </Link>
             <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="/about" className="text-foreground/70 hover:text-foreground">About</Link>
                <Link href="/dashboard/courses" className="text-foreground/70 hover:text-foreground">Courses</Link>
                <Link href="/contact" className="text-foreground/70 hover:text-foreground">Contact</Link>
            </nav>
            <nav className="space-x-2">
              {!loading && (
                <>
                  {user ? (
                     <Button asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
              The Future of Learning is Here
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-foreground/80">
              LearnAI provides a seamless virtual classroom experience with an AI Teacher, ensuring your learning never stops.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/register"}>Get Started Free <ArrowRight className="ml-2"/></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline tracking-tight">A Smarter Way to Learn</h2>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Discover the features that make LearnAI the most advanced virtual classroom for BCA students.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                {feature.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-card border-y">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline tracking-tight">Loved by Students</h2>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">See what our students have to say about their experience with LearnAI.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((testimonial) => {
                    const testimonialAvatar = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
                    return (
                        <Card key={testimonial.name} className="bg-background">
                            <CardContent className="pt-6">
                                <p className="italic text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                                <div className="mt-4 flex items-center gap-4">
                                     <Avatar>
                                        {testimonialAvatar && <AvatarImage src={testimonialAvatar.imageUrl} alt={testimonial.name} />}
                                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
         </div>
      </section>

      {/* Final CTA Section */}
       <section className="py-20 md:py-32 bg-background">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Ready to Start Your Journey?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Join thousands of students and unlock your full potential with LearnAI. Register today and experience the future of education.
                </p>
                <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href={user ? "/dashboard" : "/register"}>Sign Up for Free <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
           </div>
       </section>
    </>
  );
}
