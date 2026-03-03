'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle2, Package } from 'lucide-react';
import { productRepository } from '@/lib/services/product-repository.stub';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useCart } from '@/components/orders/CartProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="h-5 w-32 rounded bg-zinc-100 animate-pulse" />
        <div className="h-64 rounded-lg bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package size={40} strokeWidth={1.5} className="text-zinc-300" />
        <p className="text-sm font-medium text-zinc-500">Produkt nicht gefunden.</p>
        <Link href="/products" className="text-xs font-medium text-zinc-900 underline underline-offset-4">
          Zurück zur Produktliste
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (product) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Zurück zur Produktliste
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{product.name}</h1>
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
                  {product.category}
                </p>
              </div>
              {!product.in_stock && (
                <Badge variant="muted" className="shrink-0">
                  Nicht verfügbar
                </Badge>
              )}
            </div>

            {product.description && (
              <p className="text-zinc-600 leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-3xl font-bold text-zinc-900 tabular-nums">
                {formatCurrency(product.price)}
              </span>
              <Button
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className="gap-2"
              >
                {added ? (
                  <>
                    <CheckCircle2 size={16} />
                    Hinzugefügt
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    In den Warenkorb
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
