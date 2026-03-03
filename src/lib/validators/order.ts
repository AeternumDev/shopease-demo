import { z } from 'zod';

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const orderItemSchema = z.object({
  product_id: z.string().min(1),
  product_name: z.string().min(1),
  quantity: z.number().int().positive('Menge muss mindestens 1 sein'),
  unit_price: z.number().positive(),
});

export const createOrderSchema = z.object({
  user_id: z.string().min(1),
  items: z.array(orderItemSchema).min(1, 'Mindestens ein Artikel erforderlich'),
  total: z.number().positive(),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
