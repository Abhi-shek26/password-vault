import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Providers from './providers'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Secure Password Vault',
  description: 'Generate and store your passwords securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>  {/* Use the client boundary here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
