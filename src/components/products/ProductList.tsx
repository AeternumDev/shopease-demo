'use client';

import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center">
        <PackageSearch size={36} strokeWidth={1.5} className="text-zinc-300" />
        <p className="text-sm font-medium text-zinc-500">Keine Produkte gefunden.</p>
        <p className="text-xs text-zinc-400">Versuche einen anderen Suchbegriff.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
