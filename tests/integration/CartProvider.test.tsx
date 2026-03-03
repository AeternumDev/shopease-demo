import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/components/orders/CartProvider';
import { render } from '@testing-library/react';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod-001',
  name: 'Testprodukt',
  description: null,
  price: 10.00,
  category: 'Test',
  image_url: null,
  in_stock: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockProduct2: Product = {
  ...mockProduct,
  id: 'prod-002',
  name: 'Zweites Produkt',
  price: 5.00,
};

// Test component that exposes cart state via DOM
function CartTestComponent() {
  const cart = useCart();
  return (
    <div>
      <span data-testid="item-count">{cart.itemCount}</span>
      <span data-testid="total">{cart.total}</span>
      <span data-testid="items-length">{cart.items.length}</span>
      <button onClick={() => cart.addItem(mockProduct)}>Produkt 1 hinzufÃ¼gen</button>
      <button onClick={() => cart.addItem(mockProduct2)}>Produkt 2 hinzufÃ¼gen</button>
      <button onClick={() => cart.removeItem(mockProduct.id)}>Produkt 1 entfernen</button>
      <button onClick={() => cart.clearCart()}>Warenkorb leeren</button>
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <CartTestComponent />
    </CartProvider>
  );
}

describe('CartProvider (Integration)', () => {
  it('startet mit leerem Warenkorb', () => {
    renderCart();
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
    expect(screen.getByTestId('items-length').textContent).toBe('0');
  });

  it('fÃ¼gt ein Produkt zum Warenkorb hinzu', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
  });

  it('berechnet den Gesamtpreis korrekt', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    await user.click(screen.getByText('Produkt 2 hinzufÃ¼gen'));
    expect(screen.getByTestId('total').textContent).toBe('15');
  });

  it('erhÃ¶ht die Menge bei doppeltem HinzufÃ¼gen desselben Produkts', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    // 2 of the same product â†’ itemCount=2, but items.length=1
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('items-length').textContent).toBe('1');
  });

  it('entfernt ein Produkt aus dem Warenkorb', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    await user.click(screen.getByText('Produkt 1 entfernen'));
    expect(screen.getByTestId('item-count').textContent).toBe('0');
  });

  it('leert den gesamten Warenkorb', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByText('Produkt 1 hinzufÃ¼gen'));
    await user.click(screen.getByText('Produkt 2 hinzufÃ¼gen'));
    await user.click(screen.getByText('Warenkorb leeren'));
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });
});
