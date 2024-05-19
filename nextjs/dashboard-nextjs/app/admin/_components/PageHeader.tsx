import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export default function PageHeader({
  propName,
  propButton,
  children,
}: {
  propName: string;
  propButton?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mx-6 mt-8 flex items-center justify-between gap-4 pb-10">
      <h1 className=" mb-3 text-4xl font-black">{children}</h1>
      {propButton && (
        <Button asChild>
          <Link
            href={`/admin/${propName}s/new`}
            className=" capitalize"
          >{`Add ${propName}`}</Link>
        </Button>
      )}
    </section>
  );
}
