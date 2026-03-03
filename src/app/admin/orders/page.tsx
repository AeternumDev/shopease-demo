'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { orderRepository } from '@/lib/services/order-repository.stub';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Badge } from '@/components/ui/Badge';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  shipped: 'Versendet',
  delivered: 'Geliefert',
  cancelled: 'Storniert',
};

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

  if (authLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <div className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" />
        Lade…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <ShieldCheck size={40} strokeWidth={1.5} className="text-zinc-300" />
        <p className="text-sm font-medium text-zinc-600">Kein Zugriff auf den Admin-Bereich.</p>
        <Link href="/login" className="text-xs font-medium text-zinc-900 underline underline-offset-4">
          Als Admin anmelden
        </Link>
      </div>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Bestellungen verwalten</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {!isLoading && `${orders.length} Bestellung${orders.length !== 1 ? 'en' : ''} insgesamt`}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <ShieldCheck size={12} />
          Admin
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
          <p className="text-sm text-zinc-500">Keine Bestellungen vorhanden.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left px-4 py-3 font-medium text-zinc-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden sm:table-cell">Datum</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Betrag</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600">Ändern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{order.id}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden sm:table-cell">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900 tabular-nums">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer"
                      aria-label="Status ändern"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
