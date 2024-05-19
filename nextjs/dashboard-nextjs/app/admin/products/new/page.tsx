import React from 'react';
import PageHeader from '../../_components/PageHeader';
import ProductForm from '@/app/admin/products/_components/ProductForm';

export default function NewProductPage() {
  return (
    <>
      <div className=" grid  grid-cols-1 grid-rows-[min(4rem,110px)_1fr] gap-8">
        <PageHeader propName="Add Product">New Product</PageHeader>
        <ProductForm />
      </div>
    </>
  );
}
