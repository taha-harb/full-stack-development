'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formmatters';
import { useState } from 'react';
import { addProduct } from '@/app/admin/_actions/product';
import { useFormState, useFormStatus } from 'react-dom';

export default function ProductForm() {
  const [state, action] = useFormState(addProduct, {});
  const [priceInCents, setPriceInCents] = useState<number>();

  return (
    <form className=" flex w-[50%] flex-col gap-4" action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">Name:</Label>
        <Input type="text" id="name" name="name" />
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
        <Textarea id="description" name="description" />
        {state?.description && (
          <div className=" text-sm text-destructive">{state.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File:</Label>
        <Input type="file" id="file" name="file" />
        {state?.file && (
          <div className=" text-sm text-destructive">{state.file}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image:</Label>
        <Input type="file" id="image" name="image" accept="image/*" />
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
