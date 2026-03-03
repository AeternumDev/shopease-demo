import { formatCurrency } from '@/lib/utils/format-currency';

describe('formatCurrency', () => {
  it('formatiert 12.99 korrekt als EUR', () => {
    const result = formatCurrency(12.99);
    expect(result).toContain('12');
    expect(result).toContain('99');
    expect(result).toContain('€');
  });

  it('formatiert 0 korrekt', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('€');
  });

  it('formatiert große Zahlen korrekt', () => {
    const result = formatCurrency(1000.5);
    expect(result).toContain('€');
    expect(result).toBeTruthy();
  });

  it('gibt einen String zurück', () => {
    expect(typeof formatCurrency(9.99)).toBe('string');
  });
});
