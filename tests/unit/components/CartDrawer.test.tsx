import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { CartDrawer } from '@/components/orders/CartDrawer';

describe('CartDrawer', () => {
  it('rendert nichts wenn isOpen=false', () => {
    renderWithProviders(<CartDrawer isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('rendert den Dialog wenn isOpen=true', () => {
    renderWithProviders(<CartDrawer isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: /warenkorb/i })).toBeInTheDocument();
  });

  it('zeigt "Warenkorb ist leer" wenn keine Artikel vorhanden', () => {
    renderWithProviders(<CartDrawer isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/warenkorb ist leer/i)).toBeInTheDocument();
  });

  it('ruft onClose auf wenn Schließen-Button geklickt wird', () => {
    const onClose = jest.fn();
    renderWithProviders(<CartDrawer isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /warenkorb schließen/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('zeigt den Warenkorb-Titel mit Artikelanzahl', () => {
    renderWithProviders(<CartDrawer isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/warenkorb \(0\)/i)).toBeInTheDocument();
  });
});
