'use client';
import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/components/user-provider';
import { useFirebase } from '@/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Megaphone, PlusCircle, Loader2 } from 'lucide-react';
import type { Announcement } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AnnouncementsPage() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(firestore, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const announcementsData: Announcement[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        announcementsData.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
          createdAt: data.createdAt,
        });
      });
      setAnnouncements(announcementsData);
      setLoading(false);
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: 'announcements', operation: 'list' }, error);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });
    return () => unsubscribe();
  }, [firestore]);

  const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      toast({ title: "Validation Error", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }

    startTransition(() => {
        const announcementData = {
          title,
          content,
          authorId: user?.id,
          authorName: user?.name,
          createdAt: serverTimestamp(),
        };
        const announcementsCollection = collection(firestore, 'announcements');

        addDoc(announcementsCollection, announcementData).then(() => {
            toast({ title: "Success", description: "Announcement has been posted." });
            setDialogOpen(false);
        }).catch((error) => {
            // Path is unknown for addDoc, so we can't provide full context
            console.error("Failed to create announcement:", error);
            const permissionError = new FirestorePermissionError({ path: 'announcements', operation: 'create', requestResourceData: announcementData }, error);
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: "Error", description: "Failed to post announcement.", variant: "destructive" });
        });
    });
  };

  const isPrivilegedUser = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">Stay updated with the latest news and announcements.</p>
        </div>
        {isPrivilegedUser && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateAnnouncement}>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>Fill in the details below to post a new announcement.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" name="title" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">Content</Label>
                    <Textarea id="content" name="content" className="col-span-3" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Announcement
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              <Megaphone className="mx-auto h-12 w-12" />
              <p className="mt-4">No announcements have been posted yet.</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>Posted on {announcement.date}</CardDescription>
                  </div>
                  <Megaphone className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
