'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { orderRepository } from '@/lib/services/order-repository.stub';
import { Order } from '@/types';
import { OrderSummary } from '@/components/orders/OrderSummary';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const data = await orderRepository.getByUserId(user.id);
        setOrders(data);
      }
      setIsLoading(false);
    };
    void load();
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <ClipboardList size={40} strokeWidth={1.5} className="text-zinc-300" />
        <p className="text-sm text-zinc-600">
          Bitte{' '}
          <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-4">
            melden Sie sich an
          </Link>
          , um Ihre Bestellungen zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Meine Bestellungen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {!isLoading && `${orders.length} Bestellung${orders.length !== 1 ? 'en' : ''}`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
          <ClipboardList size={36} strokeWidth={1.5} className="text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">Keine Bestellungen vorhanden.</p>
          <Link
            href="/products"
            className="text-xs font-medium text-zinc-900 underline underline-offset-4"
          >
            Jetzt einkaufen
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderSummary key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
