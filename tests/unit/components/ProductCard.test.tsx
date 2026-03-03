import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';
import { CartProvider } from '@/components/orders/CartProvider';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod-001',
  name: 'Bambuszahnbürste Set',
  description: 'Nachhaltiges 4er-Set',
  price: 12.99,
  category: 'Hygiene',
  image_url: null,
  in_stock: true,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

const outOfStockProduct: Product = { ...mockProduct, in_stock: false };

function renderWithCart(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('ProductCard', () => {
  it('zeigt Produktname und Preis an', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Bambuszahnbürste Set')).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('zeigt die Produktkategorie an', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Hygiene')).toBeInTheDocument();
  });

  it('zeigt "Nicht verfügbar" Badge bei nicht vorrätigem Produkt', () => {
    renderWithCart(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Nicht verfügbar')).toBeInTheDocument();
  });

  it('deaktiviert den Warenkorb-Button bei nicht vorrätigem Produkt', () => {
    renderWithCart(<ProductCard product={outOfStockProduct} />);
    const button = screen.getByRole('button', { name: /warenkorb/i });
    expect(button).toBeDisabled();
  });

  it('Warenkorb-Button ist aktiv bei vorrätigem Produkt', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /warenkorb/i });
    expect(button).not.toBeDisabled();
  });

  it('zeigt die Produktbeschreibung an', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Nachhaltiges 4er-Set')).toBeInTheDocument();
  });
});
