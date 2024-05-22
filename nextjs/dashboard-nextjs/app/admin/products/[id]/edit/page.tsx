import React from 'react';
import PageHeader from '@/app/admin/_components/PageHeader';
import ProductForm from '@/app/admin/products/_components/ProductForm';
import db from '@/app/db/db';

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  return (
    <>
      <div className=" grid  grid-cols-1 grid-rows-[min(4rem,110px)_1fr] gap-8">
        <PageHeader propName="Edit Product">Edit Product</PageHeader>

        <ProductForm product={product} />
      </div>
    </>
  );
}
