'use client';

import React from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCart } from '@/components/orders/CartProvider';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="rounded border border-gray-200 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        {!product.in_stock && (
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            Nicht verfügbar
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">{product.category}</p>

      {product.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
        <Button
          size="sm"
          disabled={!product.in_stock}
          onClick={() => addItem(product)}
          aria-label={`${product.name} in den Warenkorb`}
        >
          In den Warenkorb
        </Button>
      </div>
    </div>
  );
}
