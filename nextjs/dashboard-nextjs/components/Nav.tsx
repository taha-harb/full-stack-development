'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Component, ComponentProps, ReactNode } from 'react';

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="flex h-svh w-40 flex-col bg-primary pl-2 pt-10 text-primary-foreground">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:rounded-s-sm hover:bg-secondary hover:text-secondary-foreground',
        'focus-visible:rounded-s-sm focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href &&
          ' rounded-s-sm bg-background text-foreground',
      )}
    />
  );
}
