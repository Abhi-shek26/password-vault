import RegisterForm from '../components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
        <div className="p-8 bg-card rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Create Your Account</h2>
            <RegisterForm />
            <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-400 hover:underline">
                Login
            </Link>
            </p>
        </div>
    </main>
  );
}
