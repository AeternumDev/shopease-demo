import { orderStatusSchema, createOrderSchema } from '@/lib/validators/order';

describe('orderStatusSchema', () => {
  it('akzeptiert alle gültigen Status', () => {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    for (const status of validStatuses) {
      const result = orderStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    }
  });

  it('lehnt ungültigen Status ab', () => {
    const result = orderStatusSchema.safeParse('unknown');
    expect(result.success).toBe(false);
  });
});

describe('createOrderSchema', () => {
  const validOrder = {
    user_id: 'user-001',
    items: [
      {
        product_id: 'prod-001',
        product_name: 'Testprodukt',
        quantity: 2,
        unit_price: 9.99,
      },
    ],
    total: 19.98,
  };

  it('akzeptiert eine gültige Bestellung', () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('lehnt leeres items-Array ab', () => {
    const result = createOrderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it('lehnt negative Menge ab', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [{ ...validOrder.items[0], quantity: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it('lehnt fehlende user_id ab', () => {
    const result = createOrderSchema.safeParse({ ...validOrder, user_id: '' });
    expect(result.success).toBe(false);
  });
});
