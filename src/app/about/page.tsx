import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const teamMembers = [
    { name: "Dr. Ananya Sharma", role: "Founder & CEO", avatarId: "teacher-avatar-1" },
    { name: "Rohan Kapoor", role: "Lead Developer", avatarId: "student-avatar-1" },
    { name: "Saanvi Desai", role: "AI Specialist", avatarId: "student-avatar-2" },
    { name: "Vikram Singh", role: "Head of Curriculum", avatarId: "teacher-avatar-2" },
]

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');

    return (
        <>
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-card border-b">
                {aboutImage && (
                    <Image
                        src={aboutImage.imageUrl}
                        alt={aboutImage.description}
                        fill
                        className="object-cover opacity-10"
                        data-ai-hint={aboutImage.imageHint}
                    />
                )}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
                        About LearnAI
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-foreground/80">
                        Revolutionizing education by making personalized, AI-driven learning accessible to everyone, everywhere.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                         <h2 className="text-3xl font-bold font-headline tracking-tight">Our Mission</h2>
                         <p className="mt-4 text-muted-foreground">
                            At LearnAI, our mission is to break down the barriers to quality education. We believe that every student deserves a personalized learning experience that adapts to their unique pace and style. By harnessing the power of artificial intelligence, we create engaging and effective virtual classrooms that empower both students and teachers.
                         </p>
                         <p className="mt-4 text-muted-foreground">
                            We are committed to building a future where education is not a one-size-fits-all model, but a dynamic and interactive journey of discovery.
                         </p>
                    </div>
                     <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                         <Image src="https://picsum.photos/seed/mission/800/600" alt="Our Mission" fill className="object-cover" data-ai-hint="team collaboration" />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-24 bg-card border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline tracking-tight">Meet the Team</h2>
                        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">The brilliant minds dedicated to building the future of education.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member) => {
                            const memberAvatar = PlaceHolderImages.find(p => p.id === member.avatarId);
                            return (
                                <Card key={member.name} className="text-center border-none shadow-none bg-transparent">
                                    <CardContent className="p-0">
                                        <Avatar className="h-32 w-32 mx-auto shadow-md">
                                            {memberAvatar && <AvatarImage src={memberAvatar.imageUrl} alt={member.name} />}
                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="mt-4 text-lg font-medium font-headline">{member.name}</h3>
                                        <p className="text-primary">{member.role}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
