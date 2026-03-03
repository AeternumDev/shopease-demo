'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/orders/CartProvider';
import { CartDrawer } from '@/components/orders/CartDrawer';

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={2} />
            ShopEase
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <Package size={15} />
              Produkte
            </Link>
            {user && (
              <Link
                href="/orders"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <ShoppingBag size={15} />
                Bestellungen
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/products"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <ShieldCheck size={15} />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Warenkorb öffnen"
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth actions */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-zinc-500 max-w-[130px] truncate">{user.email}</span>
                <button
                  onClick={() => void signOut()}
                  aria-label="Abmelden"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-zinc-50 hover:bg-zinc-700 transition-colors"
                >
                  Registrieren
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Menü öffnen"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-zinc-100 bg-white px-4 py-3 flex flex-col gap-1">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <Package size={15} /> Produkte
            </Link>
            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <ShoppingBag size={15} /> Bestellungen
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
            <div className="mt-2 border-t border-zinc-100 pt-2">
              {user ? (
                <button
                  onClick={() => { void signOut(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <LogOut size={15} /> Abmelden ({user.email})
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors">Anmelden</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors">Registrieren</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
