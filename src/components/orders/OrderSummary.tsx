'use client';

import React from 'react';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="rounded border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">#{order.id}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{formatDate(order.created_at)}</span>
        <span className="font-bold">{formatCurrency(order.total)}</span>
      </div>

      <ul className="border-t pt-2 flex flex-col gap-1">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity}× {item.product_name}
            </span>
            <span className="text-gray-500">{formatCurrency(item.unit_price * item.quantity)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
