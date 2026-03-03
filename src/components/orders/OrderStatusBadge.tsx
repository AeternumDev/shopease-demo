'use client';

import React from 'react';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Ausstehend',
    className: 'bg-yellow-100 text-yellow-800',
  },
  confirmed: {
    label: 'Bestätigt',
    className: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Versendet',
    className: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Geliefert',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Storniert',
    className: 'bg-gray-100 text-gray-600',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
