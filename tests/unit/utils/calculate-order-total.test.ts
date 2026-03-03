import { calculateOrderTotal } from '@/lib/utils/calculate-order-total';
import { CartItem } from '@/types';

const makeItem = (price: number, quantity: number): CartItem => ({
  product: {
    id: 'p1',
    name: 'Testprodukt',
    description: null,
    price,
    category: 'Test',
    image_url: null,
    in_stock: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  quantity,
});

describe('calculateOrderTotal', () => {
  it('berechnet den Total für einen Artikel korrekt', () => {
    const items = [makeItem(12.99, 1)];
    expect(calculateOrderTotal(items)).toBe(12.99);
  });

  it('berechnet den Total für mehrere Artikel korrekt', () => {
    const items = [makeItem(10, 2), makeItem(5, 3)];
    expect(calculateOrderTotal(items)).toBe(35);
  });

  it('gibt 0 für eine leere Liste zurück', () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  it('rundet auf 2 Dezimalstellen', () => {
    const items = [makeItem(1 / 3, 3)];
    const result = calculateOrderTotal(items);
    expect(Number.isFinite(result)).toBe(true);
    const decimalPlaces = (result.toString().split('.')[1] ?? '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});
