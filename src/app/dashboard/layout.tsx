'use client';
import type { ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/dashboard/main-sidebar";
import { Header } from "@/components/dashboard/header";
import { useUser } from "@/components/user-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
}
