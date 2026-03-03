'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { registerSchema } from '@/lib/validators/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Konto erstellen</CardTitle>
        <p className="text-sm text-zinc-500">Jetzt registrieren und loslegen.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {success && (
            <div role="status" className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-700">
                Registrierung erfolgreich!{' '}
                <Link href="/login" className="font-medium underline underline-offset-4">
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          )}

          <Input
            id="email"
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            placeholder="name@beispiel.de"
          />

          <Input
            id="password"
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            placeholder="••••••••"
          />

          <Input
            id="passwordConfirm"
            label="Passwort bestätigen"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={errors.passwordConfirm}
            autoComplete="new-password"
            placeholder="••••••••"
          />

          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Wird registriert…' : 'Registrieren'}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            Bereits registriert?{' '}
            <Link href="/login" className="font-medium text-zinc-900 hover:underline underline-offset-4">
              Anmelden
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
