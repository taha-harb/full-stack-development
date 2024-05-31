'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Component, ComponentProps, ReactNode } from 'react';

export function Nav({
  children,
  iscol,
}: {
  children: ReactNode;
  iscol?: boolean;
}) {
  return (
    <nav
      className={cn(
        'flex justify-center bg-primary text-primary-foreground',
        iscol && 'w-40  flex-col justify-start pl-2 pt-10',
      )}
    >
      {children}
    </nav>
  );
}

export function NavLink(
  props: Omit<ComponentProps<typeof Link>, 'className'> & { iscol?: boolean },
) {
  const pathname = usePathname();
  return (
    <Link
      className={cn(
        'p-4  hover:bg-secondary hover:text-secondary-foreground',
        ' focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathname === props.href && '  bg-background text-foreground',
        props.iscol &&
          'rounded-s-sm hover:rounded-s-sm focus-visible:rounded-s-sm',
      )}
      {...props}
    />
  );
}
