'use client';

import React from 'react';
import { OrderStatus } from '@/types';
import { Badge, type badgeVariants } from '@/components/ui/Badge';
import type { VariantProps } from 'class-variance-authority';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: 'Ausstehend', variant: 'yellow' },
  confirmed: { label: 'Bestätigt', variant: 'blue' },
  shipped: { label: 'Versendet', variant: 'violet' },
  delivered: { label: 'Geliefert', variant: 'green' },
  cancelled: { label: 'Storniert', variant: 'muted' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
