'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-background p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-foreground">
          Password Vault
        </Link>
        <div className="flex items-center gap-4">
          {/* Always render the theme toggle */}
          <ThemeToggle />
          {status === 'authenticated' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground hidden sm:block">{session.user?.email}</span>
              <Button onClick={() => signOut({ callbackUrl: '/' })} variant="danger">
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
