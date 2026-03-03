import { AuthServiceStub } from '@/lib/services/auth-service.stub';

describe('AuthServiceStub', () => {
  let service: AuthServiceStub;

  beforeEach(() => {
    service = new AuthServiceStub();
  });

  describe('signIn', () => {
    it('gibt Session zurück bei korrekten Testuser-Daten', async () => {
      const { session, error } = await service.signIn('kunde@shopease.de', 'testpasswort123');
      expect(error).toBeNull();
      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('kunde@shopease.de');
      expect(session?.token).toMatch(/^stub-token-/);
    });

    it('gibt Admin-Session zurück für Admin-User', async () => {
      const { session, error } = await service.signIn('admin@shopease.de', 'testpasswort123');
      expect(error).toBeNull();
      expect(session?.user.role).toBe('admin');
    });

    it('gibt Fehler bei unbekannter E-Mail zurück', async () => {
      const { session, error } = await service.signIn('unbekannt@example.com', 'testpasswort123');
      expect(session).toBeNull();
      expect(error).toBe('Ungültige Anmeldedaten');
    });

    it('gibt Fehler bei zu kurzem Passwort zurück', async () => {
      const { session, error } = await service.signIn('kunde@shopease.de', 'kurz');
      expect(session).toBeNull();
      expect(error).toBe('Ungültige Anmeldedaten');
    });

    it('speichert Session nach erfolgreicher Anmeldung', async () => {
      await service.signIn('kunde@shopease.de', 'testpasswort123');
      const session = service.getSession();
      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('kunde@shopease.de');
    });
  });

  describe('signUp', () => {
    it('gibt Fehler zurück wenn E-Mail bereits registriert', async () => {
      const { user, error } = await service.signUp('kunde@shopease.de', 'neuesPasswort123');
      expect(user).toBeNull();
      expect(error).toBe('E-Mail bereits registriert');
    });

    it('erstellt neuen User bei unbekannter E-Mail', async () => {
      const { user, error } = await service.signUp('neu@example.com', 'neuesPasswort123');
      expect(error).toBeNull();
      expect(user).not.toBeNull();
      expect(user?.email).toBe('neu@example.com');
      expect(user?.role).toBe('customer');
      expect(user?.id).toMatch(/^user-/);
    });
  });

  describe('signOut', () => {
    it('beendet die Sitzung des eingeloggten Users', async () => {
      await service.signIn('kunde@shopease.de', 'testpasswort123');
      await service.signOut();
      const session = service.getSession();
      expect(session).toBeNull();
    });
  });

  describe('getSession', () => {
    it('gibt null zurück wenn kein User eingeloggt', () => {
      expect(service.getSession()).toBeNull();
    });
  });
});
