'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <section className="relative py-20 md:py-32 bg-card border-b">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground">
                        Get in Touch
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-foreground/80">
                        We&apos;d love to hear from you. Whether you have a question, feedback, or need support, our team is ready to help.
                    </p>
                </div>
            </section>
             <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="space-y-6">
                             <h2 className="text-3xl font-bold font-headline tracking-tight">Send us a Message</h2>
                            <form className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="Your Email" />
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="Subject of your message" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Your message..." rows={6} />
                                </div>
                                <Button type="submit" className="w-full sm:w-auto">Send Message</Button>
                            </form>
                        </div>
                        {/* Contact Info */}
                        <div className="space-y-8">
                             <h2 className="text-3xl font-bold font-headline tracking-tight">Contact Information</h2>
                             <p className="text-muted-foreground">Find us at our office or reach out via email or phone.</p>
                             <div className="space-y-4">
                                 <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <MapPin className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Our Office</h3>
                                        <p className="text-muted-foreground">123 Education Way, Knowledge City, 12345</p>
                                    </div>
                                 </div>
                                 <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <Mail className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email Us</h3>
                                        <p className="text-muted-foreground">support@learnai.com</p>
                                    </div>
                                 </div>
                                  <div className="flex items-start gap-4">
                                     <div className="bg-primary/10 text-primary p-3 rounded-full">
                                         <Phone className="h-6 w-6"/>
                                     </div>
                                    <div>
                                        <h3 className="font-semibold">Call Us</h3>
                                        <p className="text-muted-foreground">(123) 456-7890</p>
                                    </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
