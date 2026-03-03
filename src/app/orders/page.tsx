'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { orderRepository } from '@/lib/services/order-repository.stub';
import { Order } from '@/types';
import { OrderSummary } from '@/components/orders/OrderSummary';
import Link from 'next/link';

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
      <main className="p-8 text-center">
        <p>
          Bitte{' '}
          <Link href="/login" className="text-blue-600 underline">
            melden Sie sich an
          </Link>
          , um Ihre Bestellungen zu sehen.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Meine Bestellungen</h1>
      {isLoading ? (
        <p className="text-gray-500">Lade Bestellungen…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Keine Bestellungen vorhanden.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderSummary key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
