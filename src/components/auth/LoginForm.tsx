'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { loginSchema } from '@/lib/validators/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'email' | 'password';
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setServerError(error);
      } else {
        router.push('/products');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Anmelden</CardTitle>
        <p className="text-sm text-zinc-500">Geben Sie Ihre Zugangsdaten ein.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {serverError && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
              <p role="alert" className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Anmelden…' : 'Anmelden'}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            Noch kein Konto?{' '}
            <Link href="/register" className="font-medium text-zinc-900 hover:underline underline-offset-4">
              Registrieren
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
