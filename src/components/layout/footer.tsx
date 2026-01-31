import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Icons.logo className="h-8 w-8" />
              <span className="font-headline">Learnify</span>
            </Link>
            <p className="text-muted-foreground text-sm">The future of learning, powered by AI.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                 <Link href="#" aria-label="GitHub"><Github className="h-5 w-5" /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold font-headline text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
               <li><Link href="/dashboard/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-semibold font-headline text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold font-headline text-foreground">Stay Updated</h3>
            <p className="mt-4 text-sm text-muted-foreground">Subscribe to our newsletter for the latest updates.</p>
            {/* Newsletter form can be added here later */}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Learnify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
