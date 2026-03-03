import { IOrderRepository } from './order-repository';
import { Order, OrderStatus } from '@/types';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

/**
 * Stub-Implementierung des Order-Repository.
 * Verwaltet Bestellungen in einem In-Memory-Array.
 * Validiert Statusübergänge gemäß definiertem State-Machine-Pattern.
 */
export class OrderRepositoryStub implements IOrderRepository {
  private orders: Order[] = [];

  async create(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const order: Order = {
      ...data,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.user_id === userId);
  }

  async getAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    if (!VALID_TRANSITIONS[order.status].includes(status)) {
      throw new Error(`Ungültiger Statusübergang: ${order.status} → ${status}`);
    }

    order.status = status;
    order.updated_at = new Date().toISOString();
    return order;
  }
}

export const orderRepository = new OrderRepositoryStub();
