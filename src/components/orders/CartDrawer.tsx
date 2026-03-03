'use client';

import React from 'react';
import { useCart } from './CartProvider';
import { formatCurrency } from '@/lib/utils/format-currency';
import { Button } from '@/components/ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Warenkorb"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Warenkorb ({itemCount})</h2>
        <button onClick={onClose} aria-label="Warenkorb schließen" className="text-gray-500 hover:text-gray-900">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Ihr Warenkorb ist leer.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.product.id} className="flex items-center gap-3 border-b pb-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="rounded border px-2 py-0.5 text-sm"
                    aria-label="Menge verringern"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="rounded border px-2 py-0.5 text-sm"
                    aria-label="Menge erhöhen"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 text-sm"
                  aria-label="Artikel entfernen"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-4 flex flex-col gap-3">
          <div className="flex justify-between font-semibold">
            <span>Gesamt:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button>Zur Kasse</Button>
          <Button variant="secondary" onClick={clearCart}>
            Warenkorb leeren
          </Button>
        </div>
      )}
    </div>
  );
}
