import LoginForm from '../components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
        <div className="p-8 bg-card rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Login to Your Vault</h2>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-400 hover:underline">
                Register
            </Link>
            </p>
        </div>
    </main>
  );
}
