import Link from 'next/link';
import { LockKeyhole } from 'lucide-react'; // A nice icon for visual appeal

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-center">
      <div className="mb-8 flex items-center justify-center">
        <LockKeyhole className="h-16 w-16 text-blue-500" />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        Welcome to Your Secure Vault
      </h1>

      <p className="max-w-xl text-lg text-gray-400 mb-10">
        Generate strong, unique passwords and store them in a zero-knowledge,
        encrypted vault that only you can unlock.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Login to Your Vault
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
        >
          Create a New Account
        </Link>
      </div>
    </main>
  );
}
