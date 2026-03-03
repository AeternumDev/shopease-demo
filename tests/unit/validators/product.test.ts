import { productSchema, productSearchSchema } from '@/lib/validators/product';

describe('productSchema', () => {
  it('akzeptiert ein gültiges Produkt', () => {
    const result = productSchema.safeParse({
      name: 'Testprodukt',
      description: 'Eine Beschreibung',
      price: 9.99,
      category: 'Hygiene',
      image_url: null,
      in_stock: true,
    });
    expect(result.success).toBe(true);
  });

  it('lehnt negativen Preis ab', () => {
    const result = productSchema.safeParse({
      name: 'Testprodukt',
      description: null,
      price: -5,
      category: 'Hygiene',
      image_url: null,
      in_stock: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'price')).toBe(true);
    }
  });

  it('lehnt fehlenden Produktnamen ab', () => {
    const result = productSchema.safeParse({
      name: '',
      description: null,
      price: 9.99,
      category: 'Hygiene',
      image_url: null,
      in_stock: true,
    });
    expect(result.success).toBe(false);
  });

  it('verwendet Standard-Werte für optionale Felder', () => {
    const result = productSchema.safeParse({
      name: 'Testprodukt',
      price: 9.99,
      category: 'Küche',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.in_stock).toBe(true);
      expect(result.data.description).toBeNull();
    }
  });
});

describe('productSearchSchema', () => {
  it('akzeptiert gültigen Suchbegriff', () => {
    const result = productSearchSchema.safeParse({ query: 'Bambus' });
    expect(result.success).toBe(true);
  });

  it('lehnt leeren Suchbegriff ab', () => {
    const result = productSearchSchema.safeParse({ query: '' });
    expect(result.success).toBe(false);
  });

  it('lehnt zu langen Suchbegriff ab', () => {
    const result = productSearchSchema.safeParse({ query: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });
});
