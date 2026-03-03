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
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Produkte</h1>
      {isLoading ? (
        <p className="text-gray-500">Lade Produkte…</p>
      ) : (
        <ProductSearch initialProducts={products} />
      )}
    </main>
  );
}
