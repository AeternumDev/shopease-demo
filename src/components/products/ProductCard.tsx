'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCart } from '@/components/orders/CartProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-sm">
      {/* Color band by category */}
      <div className="h-1 bg-zinc-200" />
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 leading-snug">{product.name}</h3>
          {!product.in_stock && (
            <Badge variant="muted" className="shrink-0">
              Nicht verfügbar
            </Badge>
          )}
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {product.category}
        </p>

        {product.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-zinc-900">
            {formatCurrency(product.price)}
          </span>
          <Button
            size="sm"
            disabled={!product.in_stock}
            onClick={() => addItem(product)}
            aria-label={`${product.name} in den Warenkorb`}
            className="gap-1.5"
          >
            <ShoppingCart size={14} />
            In den Warenkorb
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
