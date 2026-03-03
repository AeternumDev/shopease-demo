import { AuthSession, User } from '@/types';

export interface IAuthService {
  signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: string | null }>;
  signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }>;
  signOut(): Promise<void>;
  getSession(): AuthSession | null;
}
