'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 leading-none">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'h-9 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1',
          error ? 'border-red-400 focus:ring-red-400' : 'border-zinc-200',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

