import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/components/user-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'LearnAI',
  description: 'Virtual Classroom with AI Teacher',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        <FirebaseClientProvider>
          <UserProvider>
            <main className="flex-grow">{children}</main>
            <Toaster />
            <Footer />
          </UserProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
