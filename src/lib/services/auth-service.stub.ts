import { IAuthService } from './auth-service';
import { AuthSession, User } from '@/types';
import { TEST_USERS } from '@/lib/data/users';

/**
 * Stub-Implementierung des Auth-Service.
 * Simuliert Supabase Auth mit vordefinierten Testusern.
 * Keine Netzwerk-Calls, kein echtes Supabase-Projekt nötig.
 *
 * In einer Produktionsumgebung würde diese Klasse durch eine
 * Implementierung mit @supabase/ssr ersetzt werden.
 */
export class AuthServiceStub implements IAuthService {
  private currentSession: AuthSession | null = null;

  async signIn(email: string, password: string) {
    const user = TEST_USERS.find((u) => u.email === email);
    if (!user || password.length < 8) {
      return { session: null, error: 'Ungültige Anmeldedaten' };
    }
    this.currentSession = {
      user,
      token: `stub-token-${user.id}`,
    };
    return { session: this.currentSession, error: null };
  }

  async signUp(email: string, _password: string) {
    if (TEST_USERS.some((u) => u.email === email)) {
      return { user: null, error: 'E-Mail bereits registriert' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role: 'customer',
    };
    return { user: newUser, error: null };
  }

  async signOut() {
    this.currentSession = null;
  }

  getSession() {
    return this.currentSession;
  }
}

export const authService = new AuthServiceStub();
