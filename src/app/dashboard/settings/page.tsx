'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Your new settings have been applied.",
    });
  }

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and system settings.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your password and notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                      <Label htmlFor='notifications-switch'>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about announcements and assignments.</p>
                  </div>
                  <Switch 
                    id="notifications-switch"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
              </div>
              <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
              </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
