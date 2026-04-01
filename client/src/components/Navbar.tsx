import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-glow transition-all">
            Mocklytics
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="#analytics" className="hover:text-primary transition-colors">Analytics</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/upload">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(0,194,255,0.5)]">
              Start Interview
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
