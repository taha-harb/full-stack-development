'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formmatters';
import { useState } from 'react';
import { addProduct, updateProduct } from '@/app/admin/_actions/product';
import { useFormState, useFormStatus } from 'react-dom';
import { Product } from '@prisma/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProductForm({ product }: { product?: Product | null }) {
  const [state, action] = useFormState(
    product != null ? updateProduct.bind(null, product.id) : addProduct,
    {},
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents,
  );

  return (
    <form className=" flex w-[50%] flex-col gap-4" action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">Name:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={product?.name || ''}
        />
        {state?.name && (
          <div className=" text-sm text-destructive">{state.name}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents:</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        {state?.priceInCents && (
          <div className=" text-sm text-destructive">{state.priceInCents}</div>
        )}
        <div className=" text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description:</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description || ''}
        />
        {state?.description && (
          <div className=" text-sm text-destructive">{state.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File:</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required={product == null}
          className={cn(product != null && 'hidden')}
        />
        {product != null && (
          <div
            className=" cursor-pointer text-sm text-muted-foreground hover:underline"
            onClick={() => document.getElementById('file')?.click()}
          >
            {product.filePath}
          </div>
        )}

        {state?.file && (
          <div className=" text-sm text-destructive">{state.file}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image:</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required={product == null}
          className={cn(product != null && 'hidden')}
        />
        {product != null && (
          <Image
            src={product?.imagePath}
            width="300"
            height="300"
            alt={product.name}
            className=" border hover:border-2 hover:border-solid"
            onClick={() => document.getElementById('image')?.click()}
          />
        )}
        {state?.image && (
          <div className=" text-sm text-destructive">{state.image}</div>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="ml-auto mr-0 w-20 basis-0 py-4"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}
