'use client';
import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useFirebase } from '@/firebase';
import { useUser, UserRole } from '@/components/user-provider';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function ManageUsersPage() {
    const { user, updateUserRole } = useUser();
    const router = useRouter();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [isRoleDialogOpen, setRoleDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState<UserRole>('student');
    const [isUpdating, startUpdating] = useTransition();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        const q = query(collection(firestore, "users"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersData: UserProfile[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() } as UserProfile);
            });
            setUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);
    
    if (!user || user.role !== 'admin') {
        return null;
    }
    
    const handleOpenRoleDialog = (userToEdit: UserProfile) => {
        setEditingUser(userToEdit);
        setNewRole(userToEdit.role);
        setRoleDialogOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!editingUser) return;
        startUpdating(async () => {
            try {
                await updateUserRole(editingUser.id, newRole);
                toast({ title: "Success", description: `${editingUser.firstName}'s role has been updated.` });
                setRoleDialogOpen(false);
                setEditingUser(null);
            } catch (error: any) {
                toast({ title: "Error", description: error.message || "Failed to update role.", variant: "destructive" });
            }
        });
    };

    const getRoleVariant = (role: string) => {
        switch (role) {
            case 'admin': return 'destructive';
            case 'teacher': return 'default';
            default: return 'secondary';
        }
    };
    
  return (
    <>
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Manage Users</h2>
                <p className="text-muted-foreground">View and manage user roles in the system.</p>
            </div>
       </div>
      <Card>
        <CardContent className="pt-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        { u.id !== user.id && (
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenRoleDialog(u)}>
                                                        Change Role
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
    <Dialog open={isRoleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Change Role for {editingUser?.firstName}</DialogTitle>
                <DialogDescription>Select the new role for this user. This will change their permissions.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateRole} disabled={isUpdating || newRole === editingUser?.role}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
