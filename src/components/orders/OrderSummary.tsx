'use client';

import React from 'react';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { formatDate } from '@/lib/utils/format-date';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <Card>
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded">
              #{order.id}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-zinc-900">{formatCurrency(order.total)}</p>
            <p className="text-xs text-zinc-400">{formatDate(order.created_at)}</p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-zinc-100 pt-3">
          <ul className="flex flex-col gap-1.5">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">
                  <span className="font-medium text-zinc-500 mr-1">{item.quantity}×</span>
                  {item.product_name}
                </span>
                <span className="text-zinc-500 tabular-nums">
                  {formatCurrency(item.unit_price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
