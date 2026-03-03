'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productRepository } from '@/lib/services/product-repository.stub';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCart } from '@/components/orders/CartProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : String(params.id);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productRepository.getById(id).then((data) => {
      setProduct(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <p className="p-8 text-gray-500">Lade Produkt…</p>;
  if (!product) return <p className="p-8 text-gray-500">Produkt nicht gefunden.</p>;

  function handleAddToCart() {
    if (product) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8 flex flex-col gap-6">
      <Link href="/products" className="text-blue-600 underline text-sm">
        ← Zurück zur Produktliste
      </Link>

      <div className="rounded border border-gray-200 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {!product.in_stock && (
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              Nicht verfügbar
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">{product.category}</p>

        {product.description && (
          <p className="text-gray-700">{product.description}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
          <Button disabled={!product.in_stock} onClick={handleAddToCart}>
            {added ? 'Hinzugefügt ✓' : 'In den Warenkorb'}
          </Button>
        </div>
      </div>
    </main>
  );
}
