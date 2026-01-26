import { Icons } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgImage = PlaceHolderImages.find((p) => p.id === 'auth-background');

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover"
          data-ai-hint={bgImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/90" />
      <Link
        href="/"
        className="absolute left-8 top-8 z-20 flex items-center text-lg font-bold tracking-tight text-foreground"
      >
        <Icons.logo className="mr-2 h-6 w-6" />
        <span className="font-headline">LearnAI</span>
      </Link>
      <div className="relative z-10 w-full max-w-md p-4">{children}</div>
    </div>
  );
}
