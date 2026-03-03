import { CartItem } from '@/types';

export function calculateOrderTotal(items: CartItem[]): number {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return Math.round(total * 100) / 100;
}
