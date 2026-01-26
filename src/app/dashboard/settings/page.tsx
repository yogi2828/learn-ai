import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and system settings.</p>
      </div>

      <Card>
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
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about announcements and assignments.</p>
                </div>
                <Switch />
            </div>
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
