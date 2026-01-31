'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ViewAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">View Attendance</h2>
        <p className="text-muted-foreground">This feature is currently under development.</p>
      </div>
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          <Users className="mx-auto h-12 w-12" />
          <p className="mt-4">The attendance viewing feature is being built and will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
