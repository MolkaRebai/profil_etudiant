import { Brain } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Brain className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
      <h1 className="text-xl font-bold text-primary group-hover:text-primary/90 whitespace-nowrap">
        <span className="hidden group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden md:inline">Étudiant Bien-Être</span>
      </h1>
    </Link>
  );
}
