'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Construction } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">Mark your attendance for today's classes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Status</CardTitle>
          <CardDescription>This feature is currently under construction and will be available soon.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center text-muted-foreground space-y-4">
          <Construction className="mx-auto h-12 w-12 text-yellow-500" />
          <p className="font-semibold text-lg">Feature Coming Soon!</p>
          <p>The ability to mark and track your attendance is being developed. Stay tuned!</p>
          <Button disabled>Mark Present</Button>
        </CardContent>
      </Card>
    </div>
  );
}
