'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ProfileFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

export default function ProfilePage() {
    const { user, updateUserProfile } = useUser();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    // The user is guaranteed to be non-null by the layout
    const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileFormValues>({
        defaultValues: {
            firstName: user!.firstName,
            lastName: user!.lastName,
            email: user!.email,
            phone: user!.phone,
            address: user!.address,
        }
    });

    const onSubmit = (data: ProfileFormValues) => {
        startTransition(async () => {
            try {
                await updateUserProfile(data);
                toast({ title: "Profile Updated", description: "Your information has been saved." });
            } catch (error) {
                toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
            }
        });
    }

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Profile</h2>
            <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user!.avatarUrl} alt={user!.name} />
                        <AvatarFallback>{user!.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{user!.name}</CardTitle>
                        <CardDescription>Role: <span className="font-medium text-primary">{user!.role}</span></CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...register("firstName")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...register("lastName")} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" {...register("phone")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                        <Button type="submit" disabled={isPending || !isDirty}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>

    </div>
  );
}
