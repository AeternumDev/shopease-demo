'use client';

import React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from './CartProvider';
import { formatCurrency } from '@/lib/utils/format-currency';
import { Button } from '@/components/ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {isOpen && <div
        role="dialog"
        aria-label="Warenkorb"
        aria-modal="true"
        className={[
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl',
          'transition-transform duration-300 ease-in-out',
          'translate-x-0',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-zinc-700" />
            <h2 className="font-semibold text-zinc-900">Warenkorb ({itemCount})</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Warenkorb schließen"
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag size={40} strokeWidth={1.5} className="text-zinc-200" />
              <p className="text-sm font-medium text-zinc-500">Ihr Warenkorb ist leer.</p>
              <p className="text-xs text-zinc-400">Fügen Sie Produkte hinzu.</p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-zinc-100">
              {items.map((item) => (
                <li key={item.product.id} className="flex items-center gap-3 py-4">
                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatCurrency(item.product.price)} / Stück
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                      aria-label="Menge verringern"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                      aria-label="Menge erhöhen"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Artikel entfernen"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Zwischensumme</span>
              <span className="text-lg font-bold text-zinc-900 tabular-nums">
                {formatCurrency(total)}
              </span>
            </div>
            <Button className="w-full">Zur Kasse</Button>
            <Button variant="secondary" onClick={clearCart} className="w-full">
              Warenkorb leeren
            </Button>
          </div>
        )}
      </div>}
    </>
  );
}
