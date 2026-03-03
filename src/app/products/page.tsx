'use client';

import React, { useEffect, useState } from 'react';
import { productRepository } from '@/lib/services/product-repository.stub';
import { Product } from '@/types';
import { ProductSearch } from '@/components/products/ProductSearch';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productRepository.getAll().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Produkte</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {!isLoading && `${products.length} Produkte verfügbar`}
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductSearch initialProducts={products} />
      )}
    </div>
  );
}
