import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/components/user-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Footer } from '@/components/layout/footer';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Learnify',
  description: 'Virtual Classroom with AI Teacher',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'font-body antialiased flex flex-col min-h-screen',
        fontBody.variable,
        fontHeadline.variable,
        fontCode.variable
      )}>
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
