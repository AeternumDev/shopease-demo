import { loginSchema, registerSchema } from '@/lib/validators/auth';

describe('loginSchema', () => {
  it('akzeptiert gültige Anmeldedaten', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'passwort123' });
    expect(result.success).toBe(true);
  });

  it('lehnt ungültige E-Mail-Adresse ab', () => {
    const result = loginSchema.safeParse({ email: 'keine-email', password: 'passwort123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('email');
    }
  });

  it('lehnt zu kurzes Passwort ab', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'kurz' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('password');
    }
  });
});

describe('registerSchema', () => {
  it('akzeptiert gültige Registrierungsdaten', () => {
    const result = registerSchema.safeParse({
      email: 'neu@example.com',
      password: 'sicheresPasswort',
      passwordConfirm: 'sicheresPasswort',
    });
    expect(result.success).toBe(true);
  });

  it('lehnt ab, wenn Passwörter nicht übereinstimmen', () => {
    const result = registerSchema.safeParse({
      email: 'neu@example.com',
      password: 'Passwort1',
      passwordConfirm: 'Passwort2',
    });
    expect(result.success).toBe(false);
  });

  it('lehnt leere E-Mail ab', () => {
    const result = registerSchema.safeParse({
      email: '',
      password: 'passwort123',
      passwordConfirm: 'passwort123',
    });
    expect(result.success).toBe(false);
  });
});
