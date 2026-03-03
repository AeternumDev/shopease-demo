'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { productRepository } from '@/lib/services/product-repository.stub';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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

  if (authLoading) return <p className="p-8 text-gray-500">Lade…</p>;

  if (!isAdmin) {
    return (
      <main className="p-8 text-center">
        <p>
          Kein Zugriff.{' '}
          <Link href="/login" className="text-blue-600 underline">
            Als Admin anmelden
          </Link>
        </p>
      </main>
    );
  }

  async function handleDelete(id: string) {
    await productRepository.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Produkte</h1>

      {isLoading ? (
        <p className="text-gray-500">Lade Produkte…</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Kategorie</th>
              <th className="py-2 pr-4">Preis</th>
              <th className="py-2 pr-4">Verfügbar</th>
              <th className="py-2">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2 pr-4 font-medium">{product.name}</td>
                <td className="py-2 pr-4 text-gray-500">{product.category}</td>
                <td className="py-2 pr-4">{formatCurrency(product.price)}</td>
                <td className="py-2 pr-4">{product.in_stock ? 'Ja' : 'Nein'}</td>
                <td className="py-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Löschen
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
