'use client';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-[#c5c6ce] bg-white p-10 text-center">
      <h3 className="text-xl font-bold text-[#04122e]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#45464d]">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}