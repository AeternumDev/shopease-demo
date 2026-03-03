'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productRepository } from '@/lib/services/product-repository.stub';
import { ProductList } from './ProductList';
import { Input } from '@/components/ui/Input';

interface ProductSearchProps {
  initialProducts: Product[];
}

export function ProductSearch({ initialProducts }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const search = async () => {
      if (query.length >= 2) {
        const found = await productRepository.search(query);
        setResults(found);
      } else {
        setResults(initialProducts);
      }
    };
    void search();
  }, [query, initialProducts]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="product-search"
        label="Produkte suchen"
        type="search"
        placeholder="Mindestens 2 Zeichen eingeben…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Produkte suchen"
      />
      <ProductList products={results} />
    </div>
  );
}
