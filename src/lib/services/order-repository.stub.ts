import { IOrderRepository } from './order-repository';
import { Order, OrderStatus } from '@/types';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const SEED_ORDERS: Order[] = [
  {
    id: 'order-seed-001',
    user_id: 'user-kunde',
    status: 'delivered',
    total: 129.99,
    created_at: '2026-02-10T09:15:00.000Z',
    updated_at: '2026-02-14T16:30:00.000Z',
    items: [
      { id: 'item-001-1', order_id: 'order-seed-001', product_id: 'prod-1', product_name: 'Wireless Kopfhörer', quantity: 1, unit_price: 129.99 },
    ],
  },
  {
    id: 'order-seed-002',
    user_id: 'user-kunde',
    status: 'delivered',
    total: 249.50,
    created_at: '2026-02-12T11:00:00.000Z',
    updated_at: '2026-02-17T10:00:00.000Z',
    items: [
      { id: 'item-002-1', order_id: 'order-seed-002', product_id: 'prod-2', product_name: 'Smartwatch', quantity: 1, unit_price: 249.50 },
    ],
  },
  {
    id: 'order-seed-003',
    user_id: 'user-kunde2',
    status: 'shipped',
    total: 64.90,
    created_at: '2026-02-20T14:30:00.000Z',
    updated_at: '2026-02-23T08:00:00.000Z',
    items: [
      { id: 'item-003-1', order_id: 'order-seed-003', product_id: 'prod-3', product_name: 'USB-C Hub', quantity: 2, unit_price: 32.45 },
    ],
  },
  {
    id: 'order-seed-004',
    user_id: 'user-kunde3',
    status: 'confirmed',
    total: 349.00,
    created_at: '2026-02-25T16:00:00.000Z',
    updated_at: '2026-02-26T09:00:00.000Z',
    items: [
      { id: 'item-004-1', order_id: 'order-seed-004', product_id: 'prod-4', product_name: 'Mechanische Tastatur', quantity: 1, unit_price: 349.00 },
    ],
  },
  {
    id: 'order-seed-005',
    user_id: 'user-kunde',
    status: 'cancelled',
    total: 45.00,
    created_at: '2026-02-15T10:00:00.000Z',
    updated_at: '2026-02-15T18:00:00.000Z',
    items: [
      { id: 'item-005-1', order_id: 'order-seed-005', product_id: 'prod-5', product_name: 'Mauspad XL', quantity: 1, unit_price: 45.00 },
    ],
  },
  {
    id: 'order-seed-006',
    user_id: 'user-kunde2',
    status: 'pending',
    total: 89.95,
    created_at: '2026-03-01T08:45:00.000Z',
    updated_at: '2026-03-01T08:45:00.000Z',
    items: [
      { id: 'item-006-1', order_id: 'order-seed-006', product_id: 'prod-6', product_name: 'Webcam HD', quantity: 1, unit_price: 89.95 },
    ],
  },
  {
    id: 'order-seed-007',
    user_id: 'user-kunde4',
    status: 'delivered',
    total: 199.00,
    created_at: '2026-01-28T12:00:00.000Z',
    updated_at: '2026-02-02T14:00:00.000Z',
    items: [
      { id: 'item-007-1', order_id: 'order-seed-007', product_id: 'prod-7', product_name: 'Gaming-Maus', quantity: 2, unit_price: 99.50 },
    ],
  },
  {
    id: 'order-seed-008',
    user_id: 'user-kunde3',
    status: 'cancelled',
    total: 27.99,
    created_at: '2026-02-28T17:00:00.000Z',
    updated_at: '2026-02-28T20:00:00.000Z',
    items: [
      { id: 'item-008-1', order_id: 'order-seed-008', product_id: 'prod-8', product_name: 'HDMI-Kabel 2m', quantity: 1, unit_price: 27.99 },
    ],
  },
  {
    id: 'order-seed-009',
    user_id: 'user-kunde',
    status: 'shipped',
    total: 159.00,
    created_at: '2026-03-02T09:30:00.000Z',
    updated_at: '2026-03-04T07:00:00.000Z',
    items: [
      { id: 'item-009-1', order_id: 'order-seed-009', product_id: 'prod-9', product_name: 'Laptop-Ständer', quantity: 1, unit_price: 159.00 },
    ],
  },
  {
    id: 'order-seed-010',
    user_id: 'user-kunde5',
    status: 'pending',
    total: 54.90,
    created_at: '2026-03-05T07:00:00.000Z',
    updated_at: '2026-03-05T07:00:00.000Z',
    items: [
      { id: 'item-010-1', order_id: 'order-seed-010', product_id: 'prod-10', product_name: 'Bluetooth-Lautsprecher', quantity: 1, unit_price: 54.90 },
    ],
  },
];

/**
 * Stub-Implementierung des Order-Repository.
 * Verwaltet Bestellungen in einem In-Memory-Array.
 * Validiert Statusübergänge gemäß definiertem State-Machine-Pattern.
 */
export class OrderRepositoryStub implements IOrderRepository {
  private orders: Order[] = [...SEED_ORDERS];

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
