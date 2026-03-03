'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { productRepository } from '@/lib/services/product-repository.stub';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminProductsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productRepository.getAll().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <div className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin" />
        Lade…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <ShieldCheck size={40} strokeWidth={1.5} className="text-zinc-300" />
        <p className="text-sm font-medium text-zinc-600">Kein Zugriff auf den Admin-Bereich.</p>
        <Link href="/login" className="text-xs font-medium text-zinc-900 underline underline-offset-4">
          Als Admin anmelden
        </Link>
      </div>
    );
  }

  async function handleDelete(id: string) {
    await productRepository.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Produkte verwalten</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {!isLoading && `${products.length} Produkte insgesamt`}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <ShieldCheck size={12} />
          Admin
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden sm:table-cell">Kategorie</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Preis</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden md:table-cell">Verfügbar</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-600">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900">{product.name}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden sm:table-cell">{product.category}</td>
                  <td className="px-4 py-3 text-zinc-700 tabular-nums">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {product.in_stock ? (
                      <Badge variant="green">Ja</Badge>
                    ) : (
                      <Badge variant="muted">Nein</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      aria-label={`${product.name} löschen`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
