'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useUser } from '@/components/user-provider';
import {
  BookOpen,
  Bot,
  ClipboardList,
  Cog,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Presentation,
  User,
  Users,
  Video,
  UserCheck,
} from 'lucide-react';
import { Icons } from '../icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const studentNav = [
  { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/live-classes', label: 'Live Classes', icon: Presentation },
  { href: '/dashboard/recorded-lectures', label: 'AI Recorded Lectures', icon: Video },
  { href: '/dashboard/chatbot', label: 'AI Chatbot', icon: Bot },
  { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/attendance', label: 'Attendance', icon: UserCheck },
  { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/dashboard/chat-history', label: 'Chat History', icon: MessageSquare },
];

const teacherNav = [
  { href: '/dashboard/courses', label: 'Manage Courses', icon: BookOpen },
  { href: '/dashboard/ai-suggestions', label: 'AI Teacher Studio', icon: Presentation },
  { href: '/dashboard/assignments', label: 'Manage Assignments', icon: ClipboardList },
  { href: '/dashboard/view-attendance', label: 'View Attendance', icon: Users },
  { href: '/dashboard/announcements', label: 'Post Announcements', icon: Megaphone },
];

const adminNav = [
    { href: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
    { href: '/dashboard/courses', label: 'Manage Courses', icon: BookOpen },
    { href: '/dashboard/announcements', label: 'Post Announcements', icon: Megaphone},
    { href: '/dashboard/view-attendance', label: 'View Attendance', icon: Users },
];


export function MainSidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const getNavItems = () => {
    switch(user.role) {
      case 'student': return studentNav;
      case 'teacher': return teacherNav;
      case 'admin': return adminNav;
      default: return [];
    }
  }

  const isActive = (href: string) => {
    // For the main dashboard, we want an exact match.
    if (href === '/dashboard') {
      return pathname === href;
    }
    // For other routes, we check if the current path starts with the href.
    // This handles nested routes like /dashboard/courses/dsa correctly.
    return pathname.startsWith(href);
  };

  const navItems = getNavItems();
  const profileLabel = user.role === 'teacher' ? 'Faculty Profile' : 'Profile';

  return (
    <>
      <SidebarHeader className='border-b border-sidebar-border'>
        <div className="flex items-center gap-2 p-2">
            <Icons.logo className="h-8 w-8 text-sidebar-primary" />
            <span className="font-headline text-xl font-semibold text-sidebar-foreground">Learnify-AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip={{children: "Dashboard"}}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className='group-data-[collapsible=icon]:justify-center'>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.label }}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/profile'} tooltip={{ children: profileLabel }}>
              <Link href="/dashboard/profile">
                <User />
                <span>{profileLabel}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={{ children: "Settings" }}>
              <Link href="/dashboard/settings">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
