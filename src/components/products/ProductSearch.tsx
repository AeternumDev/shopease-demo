'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/types';
import { productRepository } from '@/lib/services/product-repository.stub';
import { ProductList } from './ProductList';

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
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          id="product-search"
          type="search"
          placeholder="Produkte suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Produkte suchen"
          className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 transition-colors"
        />
        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
            {results.length} Ergebnisse
          </span>
        )}
      </div>
      <ProductList products={results} />
    </div>
  );
}
