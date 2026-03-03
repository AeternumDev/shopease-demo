import { Order, OrderStatus } from '@/types';

export interface IOrderRepository {
  create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order>;
  getByUserId(userId: string): Promise<Order[]>;
  getAll(): Promise<Order[]>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>;
}
