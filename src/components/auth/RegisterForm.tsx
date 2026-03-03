'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { registerSchema } from '@/lib/validators/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setSuccess(false);

    const result = registerSchema.safeParse({ email, password, passwordConfirm });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string; passwordConfirm?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'email' | 'password' | 'passwordConfirm';
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setServerError(error);
      } else {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Registrieren</h1>

      {success && (
        <p role="status" className="text-sm text-green-600">
          Registrierung erfolgreich! Bitte melden Sie sich an.
        </p>
      )}

      <Input
        id="email"
        label="E-Mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        id="password"
        label="Passwort"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        id="passwordConfirm"
        label="Passwort bestätigen"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        error={errors.passwordConfirm}
        autoComplete="new-password"
      />

      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registrieren…' : 'Registrieren'}
      </Button>

      <p className="text-sm text-gray-600">
        Bereits registriert?{' '}
        <a href="/login" className="text-blue-600 underline">
          Anmelden
        </a>
      </p>
    </form>
  );
}
