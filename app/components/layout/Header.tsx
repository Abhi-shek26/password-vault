'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Password Vault
        </Link>
        <div>
          {status === 'authenticated' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden sm:block">{session.user?.email}</span>
              <ThemeToggle />
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
