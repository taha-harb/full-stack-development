import db from '@/app/db/db';
import ProductCard, { ProductSkeleton } from '@/components/ProductCard';
import { cache } from '@/lib/cache';
import React, { Suspense } from 'react';

const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: 'asc' },
  });
}, ['/products', 'getProducts']);

export default function ProductsPage() {
  return (
    <div className="grid grid-flow-row grid-cols-1 gap-x-1 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
      <Suspense
        fallback={
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        }
      >
        <PorductsSuspense />
      </Suspense>
    </div>
  );
}

async function PorductsSuspense() {
  const products = await getProducts();
  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
