'use client';

import { useState, useTransition, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useUser } from "../user-provider";
import { Bot, Loader2, Send } from "lucide-react";
import { getChatbotResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useFirebase } from "@/firebase";
import { addDoc, collection, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import type { Message, RecordedLecture } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export function ChatbotInterface() {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [resources, setResources] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    const [lectures, setLectures] = useState<RecordedLecture[]>([]);
    const [loadingLectures, setLoadingLectures] = useState(true);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!firestore) return;
        setLoadingLectures(true);
        const q = query(collection(firestore, "recordedLectures"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lecturesData: RecordedLecture[] = [];
            querySnapshot.forEach((doc) => {
                lecturesData.push({
                    id: doc.id,
                    ...doc.data()
                } as RecordedLecture);
            });
            setLectures(lecturesData);
            setLoadingLectures(false);
        }, () => {
            setLoadingLectures(false);
        });
        return () => unsubscribe();
    }, [firestore]);


    const saveChatSession = async (finalMessages: Message[]) => {
        if (!user || finalMessages.length === 0) return;
        try {
            await addDoc(collection(firestore, 'chats'), {
                userId: user.id,
                messages: finalMessages,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Failed to save chat session:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;
        if (!resources.trim()) {
            toast({
                title: "Context Required",
                description: "Please select a lecture or provide some course material in the context area.",
                variant: "destructive",
            });
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        startTransition(async () => {
            const result = await getChatbotResponse(input, resources);
            if(result.success && result.data) {
                const assistantMessage: Message = { role: 'assistant', content: result.data.answer };
                const finalMessages = [...newMessages, assistantMessage];
                setMessages(finalMessages);
                await saveChatSession(finalMessages);
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to get a response from the chatbot.",
                    variant: "destructive",
                });
                setMessages(prev => prev.slice(0, -1)); // remove user message on error
            }
        });
    }
    
    const handleLectureSelect = (lectureId: string) => {
        const selectedLecture = lectures.find(l => l.id === lectureId);
        if (selectedLecture) {
            const { title, introduction, sections, conclusion } = selectedLecture.script;
            const scriptText = [
                `Topic: ${selectedLecture.topic}`,
                `Title: ${title}`,
                `Introduction: ${introduction}`,
                ...sections.map(s => `Section: ${s.heading}. Content: ${s.content}`),
                `Conclusion: ${conclusion}`
            ].join('\n\n');
            setResources(scriptText);
        }
    }


    if (!user) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-10 h-full">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
             </div>
        )
    }

    return (
        <div className="grid md:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
            <div className="md:col-span-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 font-headline">Course Context</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a lecture or paste text below. The AI will use this as its knowledge base.</p>
                <div className="space-y-4 flex-grow flex flex-col">
                     <div>
                        <Label htmlFor="lecture-select">Select a Recorded Lecture</Label>
                         <Select onValueChange={handleLectureSelect} disabled={loadingLectures}>
                            <SelectTrigger id="lecture-select">
                                <SelectValue placeholder={loadingLectures ? "Loading lectures..." : "Select a lecture..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {lectures.map(lecture => (
                                    <SelectItem key={lecture.id} value={lecture.id}>{lecture.topic}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-grow flex flex-col">
                        <Label htmlFor="context-resources" className="sr-only">Context Resources</Label>
                        <Textarea 
                            id="context-resources"
                            value={resources}
                            onChange={(e) => setResources(e.target.value)}
                            className="flex-grow resize-none"
                            placeholder="Or paste relevant course material here..."
                        />
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 flex flex-col h-full bg-card border rounded-lg">
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center p-10 h-full">
                                <Bot className="h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">Select a lecture context and ask me anything about it!</p>
                             </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("rounded-lg p-3 max-w-sm md:max-w-md lg:max-w-lg shadow-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                 {message.role === 'user' && (
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isPending && (
                             <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-secondary flex items-center">
                                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            disabled={isPending}
                        />
                        <Button type="submit" size="icon" disabled={isPending}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
