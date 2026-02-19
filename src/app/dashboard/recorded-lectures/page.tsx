'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation } from 'lucide-react';

export default function RecordedLecturesPage() {
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">AI Recorded Lectures</h2>
        <p className="text-muted-foreground">Catch up on missed classes or revise topics.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Lecture Library Update</CardTitle>
            <CardDescription>This feature has been updated to provide a better live experience.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                <Presentation className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">Lectures are now delivered live!</p>
                <p className="mt-2 text-muted-foreground">AI-generated lectures are now delivered using real-time text-to-speech directly in the "Live Classes" section.</p>
                <p className="mt-1 text-xs text-muted-foreground">This change provides a more interactive and dynamic learning experience. As a result, pre-recorded audio files are no longer stored here.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
