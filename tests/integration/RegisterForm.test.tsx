import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import { RegisterForm } from '@/components/auth/RegisterForm';

describe('RegisterForm (Integration)', () => {
  it('rendert alle Felder und den Registrieren-Button', () => {
    renderWithProviders(<RegisterForm />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^passwort$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort bestätigen/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrieren/i })).toBeInTheDocument();
  });

  it('zeigt Validierungsfehler bei ungültiger E-Mail', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'keine-email');
    await user.type(screen.getByLabelText(/^passwort$/i), 'passwort123');
    await user.type(screen.getByLabelText(/passwort bestätigen/i), 'passwort123');
    await user.click(screen.getByRole('button', { name: /registrieren/i }));

    await waitFor(() => {
      expect(screen.getByText(/ungültige e-mail/i)).toBeInTheDocument();
    });
  });

  it('zeigt Validierungsfehler bei nicht übereinstimmenden Passwörtern', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^passwort$/i), 'passwort123');
    await user.type(screen.getByLabelText(/passwort bestätigen/i), 'anderes456');
    await user.click(screen.getByRole('button', { name: /registrieren/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwörter stimmen nicht überein/i)).toBeInTheDocument();
    });
  });

  it('zeigt Serverfehler wenn E-Mail bereits registriert ist', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'kunde@shopease.de');
    await user.type(screen.getByLabelText(/^passwort$/i), 'passwort123');
    await user.type(screen.getByLabelText(/passwort bestätigen/i), 'passwort123');
    await user.click(screen.getByRole('button', { name: /registrieren/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('zeigt Erfolgsmeldung bei erfolgreicher Registrierung', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/e-mail/i), 'neuerkunde@example.com');
    await user.type(screen.getByLabelText(/^passwort$/i), 'neuesPasswort123');
    await user.type(screen.getByLabelText(/passwort bestätigen/i), 'neuesPasswort123');
    await user.click(screen.getByRole('button', { name: /registrieren/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
