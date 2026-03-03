import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import { LoginForm } from '@/components/auth/LoginForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

describe('LoginForm (Integration)', () => {
  it('rendert E-Mail-Feld, Passwortfeld und Anmelden-Button', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
  });

  it('zeigt Validierungsfehler bei ungültiger E-Mail', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'keine-email');
    await user.type(screen.getByLabelText(/passwort/i), 'passwort123');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => {
      expect(screen.getByText(/ungültige e-mail/i)).toBeInTheDocument();
    });
  });

  it('zeigt Validierungsfehler bei zu kurzem Passwort', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/passwort/i), 'kurz');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => {
      expect(screen.getByText(/mindestens 8 zeichen/i)).toBeInTheDocument();
    });
  });

  it('zeigt Serverfehler bei falschen Anmeldedaten', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'falsch@example.com');
    await user.type(screen.getByLabelText(/passwort/i), 'falschesPasswort');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('erfolgreich eingeloggt mit korrekten Testuser-Daten', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'kunde@shopease.de');
    await user.type(screen.getByLabelText(/passwort/i), 'testpasswort123');
    await user.click(screen.getByRole('button', { name: /anmelden/i }));

    // Should not show error
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
