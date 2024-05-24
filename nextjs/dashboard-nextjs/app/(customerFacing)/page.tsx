import React, { Suspense } from 'react';
import db from '../db/db';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowBigRight, ArrowRight } from 'lucide-react';
import ProductCard, { ProductSkeleton } from '@/components/ProductCard';
import { cache } from '@/lib/cache';

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { Order: { _count: 'desc' } },
      take: 6,
    });
  },
  ['/', 'getMostPopularProducts'],
  { revalidate: 60 * 60 * 24 },
);
const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}, ['/', ' getNewestProducts']);

async function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
export default function Homeage() {
  return (
    <main className=" space-y-12">
      <ProductGridSection
        title="Newest Products"
        productFetcher={getNewestProducts}
      />
      <ProductGridSection
        title="Most Popular Products"
        productFetcher={getMostPopularProducts}
      />
    </main>
  );
}
type ProductGridProps = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};
async function ProductGridSection({ title, productFetcher }: ProductGridProps) {
  return (
    <section className=" grid grid-cols-1 grid-rows-[4rem_1fr] gap-1 ">
      <div className="flex gap-x-4">
        <h1 className=" text-3xl font-bold">{title}</h1>
        <Button variant={'outline'} asChild>
          <Link href={'/products'} className="flex gap-x-2">
            <span>view All</span>
            <ArrowRight className=" size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-flow-row grid-cols-1 gap-x-1 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          }
        >
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </section>
  );
}
async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
