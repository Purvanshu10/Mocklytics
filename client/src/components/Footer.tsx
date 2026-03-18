import Link from "next/link";
import { BrainCircuit, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/80 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1 border-r-0 border-r border-white/10">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-white">Mocklytics</span>
          </Link>
          <p className="text-white/50 text-sm mb-6 max-w-xs">
            AI-powered mock interviews to help you land your dream job. Real-time feedback, actionable insights.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-white/50 hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/50 hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/50 hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Use Cases</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Interview Guide</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Resume Templates</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
        <p>© {new Date().getFullYear()} Mocklytics Inc. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for the future of recruiting.</p>
      </div>
    </footer>
  );
}
