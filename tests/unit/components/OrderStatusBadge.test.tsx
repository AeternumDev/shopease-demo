import React from 'react';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderStatus } from '@/types';

describe('OrderStatusBadge', () => {
  it('zeigt "Ausstehend" für pending', () => {
    render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText('Ausstehend')).toBeInTheDocument();
  });

  it('zeigt "Bestätigt" für confirmed', () => {
    render(<OrderStatusBadge status="confirmed" />);
    expect(screen.getByText('Bestätigt')).toBeInTheDocument();
  });

  it('zeigt "Versendet" für shipped', () => {
    render(<OrderStatusBadge status="shipped" />);
    expect(screen.getByText('Versendet')).toBeInTheDocument();
  });

  it('zeigt "Geliefert" für delivered', () => {
    render(<OrderStatusBadge status="delivered" />);
    expect(screen.getByText('Geliefert')).toBeInTheDocument();
  });

  it('zeigt "Storniert" für cancelled', () => {
    render(<OrderStatusBadge status="cancelled" />);
    expect(screen.getByText('Storniert')).toBeInTheDocument();
  });

  it('verwendet unterschiedliche CSS-Klassen für verschiedene Status', () => {
    const { rerender } = render(<OrderStatusBadge status="pending" />);
    const pendingBadge = screen.getByText('Ausstehend');
    const pendingClass = pendingBadge.className;

    rerender(<OrderStatusBadge status="delivered" />);
    const deliveredBadge = screen.getByText('Geliefert');
    expect(deliveredBadge.className).not.toBe(pendingClass);
  });

  it('enthält gelbe Klasse für pending', () => {
    render(<OrderStatusBadge status={'pending' as OrderStatus} />);
    const badge = screen.getByText('Ausstehend');
    expect(badge.className).toContain('yellow');
  });

  it('enthält grüne Klasse für delivered', () => {
    render(<OrderStatusBadge status={'delivered' as OrderStatus} />);
    const badge = screen.getByText('Geliefert');
    expect(badge.className).toContain('green');
  });
});
