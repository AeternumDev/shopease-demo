import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import { ProductSearch } from '@/components/products/ProductSearch';
import { SEED_PRODUCTS } from '@/lib/data/products';

const inStockProducts = SEED_PRODUCTS.filter((p) => p.in_stock);

describe('ProductSearch (Integration)', () => {
  it('rendert das Suchfeld', () => {
    renderWithProviders(<ProductSearch initialProducts={inStockProducts} />);
    expect(screen.getByLabelText(/produkte suchen/i)).toBeInTheDocument();
  });

  it('zeigt initial alle vorhandenen Produkte', () => {
    renderWithProviders(<ProductSearch initialProducts={inStockProducts} />);
    expect(screen.getByText('Bambuszahnbürste Set')).toBeInTheDocument();
    expect(screen.getByText('Edelstahl Trinkflasche')).toBeInTheDocument();
  });

  it('filtert Produkte nach Suchbegriff', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductSearch initialProducts={inStockProducts} />);

    await user.type(screen.getByLabelText(/produkte suchen/i), 'Bambus');

    await waitFor(() => {
      expect(screen.getByText('Bambuszahnbürste Set')).toBeInTheDocument();
    });
  });

  it('zeigt "Keine Produkte" wenn kein Ergebnis gefunden', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductSearch initialProducts={inStockProducts} />);

    await user.type(screen.getByLabelText(/produkte suchen/i), 'xyzxyz');

    await waitFor(() => {
      expect(screen.getByText(/keine produkte/i)).toBeInTheDocument();
    });
  });

  it('setzt Filter zurück wenn Suchfeld geleert wird', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductSearch initialProducts={inStockProducts} />);

    const searchInput = screen.getByLabelText(/produkte suchen/i);
    await user.type(searchInput, 'Bambus');
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Edelstahl Trinkflasche')).toBeInTheDocument();
    });
  });
});
