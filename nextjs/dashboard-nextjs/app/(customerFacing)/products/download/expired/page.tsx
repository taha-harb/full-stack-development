import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Expired() {
  return (
    <>
      <h1 className=" mb-4 text-4xl">Download Link Expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
}
