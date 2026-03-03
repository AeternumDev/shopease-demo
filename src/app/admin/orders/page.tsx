'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { orderRepository } from '@/lib/services/order-repository.stub';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import Link from 'next/link';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderRepository.getAll().then((data) => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  if (authLoading) return <p className="p-8 text-gray-500">Lade…</p>;

  if (!isAdmin) {
    return (
      <main className="p-8 text-center">
        <p>
          Kein Zugriff.{' '}
          <Link href="/login" className="text-blue-600 underline">
            Als Admin anmelden
          </Link>
        </p>
      </main>
    );
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      const updated = await orderRepository.updateStatus(orderId, status);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Fehler beim Statuswechsel');
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Bestellungen</h1>

      {isLoading ? (
        <p className="text-gray-500">Lade Bestellungen…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Keine Bestellungen vorhanden.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Datum</th>
              <th className="py-2 pr-4">Betrag</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Statusänderung</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2 pr-4 font-mono text-xs">{order.id}</td>
                <td className="py-2 pr-4">{formatDate(order.created_at)}</td>
                <td className="py-2 pr-4">{formatCurrency(order.total)}</td>
                <td className="py-2 pr-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                    aria-label="Status ändern"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
