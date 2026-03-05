'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { orderRepository } from '@/lib/services/order-repository.stub';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/utils/format-currency';
import { Badge } from '@/components/ui/Badge';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  shipped: 'Versendet',
  delivered: 'Geliefert',
  cancelled: 'Storniert',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

function KpiCard({ label, value, icon, sub }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      {sub && <p className="text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderRepository.getAll().then((data) => {
      setOrders(data);
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

  // KPI-Berechnungen
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;
  const deliveryRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;
  const cancellationRate = totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100) : 0;

  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    statusCounts[order.status]++;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Übersicht aller wichtigen Kennzahlen</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <ShieldCheck size={12} />
          Admin
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI-Karten */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Kennzahlen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <KpiCard
                label="Bestellungen"
                value={String(totalOrders)}
                icon={<ShoppingCart size={16} />}
                sub="Gesamt"
              />
              <KpiCard
                label="Gesamtumsatz"
                value={formatCurrency(totalRevenue)}
                icon={<TrendingUp size={16} />}
                sub="Alle abgeschlossenen Bestellungen"
              />
              <KpiCard
                label="Ø Bestellwert"
                value={formatCurrency(avgOrderValue)}
                icon={<BarChart3 size={16} />}
                sub="Durchschnitt pro Bestellung"
              />
              <KpiCard
                label="Lieferquote"
                value={`${deliveryRate} %`}
                icon={<CheckCircle size={16} />}
                sub={`${deliveredCount} von ${totalOrders} geliefert`}
              />
              <KpiCard
                label="Stornoquote"
                value={`${cancellationRate} %`}
                icon={<XCircle size={16} />}
                sub={`${cancelledCount} stornierte Bestellungen`}
              />
              <KpiCard
                label="Produkte"
                value="—"
                icon={<Package size={16} />}
                sub="Im Sortiment"
              />
            </div>
          </section>

          {/* Status-Aufschlüsselung */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Bestellungen nach Status
            </h2>
            <div className="rounded-lg border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-600">Anzahl</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-600 hidden sm:table-cell">
                      Anteil
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(Object.keys(statusCounts) as OrderStatus[]).map((status) => (
                    <tr key={status} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-zinc-900">
                        {statusCounts[status]}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-500 hidden sm:table-cell">
                        {totalOrders > 0
                          ? `${Math.round((statusCounts[status] / totalOrders) * 100)} %`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Schnellzugriff */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Schnellzugriff
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <ShoppingCart size={15} />
                Bestellungen verwalten
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Package size={15} />
                Produkte verwalten
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
