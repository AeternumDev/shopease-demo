import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(8, { message: 'Passwort muss mindestens 8 Zeichen lang sein' }),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
    password: z.string().min(8, { message: 'Passwort muss mindestens 8 Zeichen lang sein' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwörter stimmen nicht überein',
    path: ['passwordConfirm'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
