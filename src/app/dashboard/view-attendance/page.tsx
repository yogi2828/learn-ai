'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Construction } from "lucide-react";

export default function ViewAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">View Attendance</h2>
        <p className="text-muted-foreground">Monitor student attendance records for your courses.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Dashboard</CardTitle>
          <CardDescription>This feature is currently under construction and will be available soon.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 text-center text-muted-foreground space-y-4">
          <Construction className="mx-auto h-12 w-12 text-yellow-500" />
          <p className="font-semibold text-lg">Feature Coming Soon!</p>
          <p>The ability to view detailed attendance reports is being developed. Stay tuned!</p>
           <Button disabled>Download Report</Button>
        </CardContent>
      </Card>
    </div>
  );
}
