import 'next-auth';
import { DefaultSession } from 'next-auth';

// This is the module augmentation block
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getServerSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID. */
      id: string;
    } & DefaultSession['user']; // Extend the default user properties
  }
}
