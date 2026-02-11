'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirebase } from '@/firebase';
import { useUser } from '@/components/user-provider';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { ChatSession } from '@/lib/types';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, User as UserIcon, MessageSquareDashed, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ChatHistoryPage() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, 'chats'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          messages: data.messages,
          createdAt: data.createdAt.toDate(),
        } as ChatSession;
      });
      setChatHistory(history);
      setLoading(false);
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: 'chats', operation: 'list' }, error);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">Review your past conversations with the AI Chatbot.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
          <CardDescription>Click on a conversation to see the full transcript.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
              <MessageSquareDashed className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">You have no saved chat history.</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/dashboard/chatbot">Go to Chatbot</Link>
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {chatHistory.map((session) => (
                <AccordionItem value={session.id} key={session.id}>
                  <AccordionTrigger>
                    Conversation from {session.createdAt.toLocaleString()}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                      {session.messages.map((message, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {message.role === 'assistant' ? <Bot className="h-5 w-5 text-primary" /> : <UserIcon className="h-5 w-5 text-muted-foreground" />}
                          <p className="text-sm pt-0.5">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
