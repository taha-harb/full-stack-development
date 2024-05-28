import React from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formmatters';
import Stripe from 'stripe';
import { notFound } from 'next/navigation';
import db from '@/app/db/db';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function purchaseSucessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent,
  );
  if (paymentIntent.metadata.productId == null) return notFound();
  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return notFound();
  const isSuccess = paymentIntent.status === 'succeeded';
  return (
    <div className=" w-full  max-w-5xl space-y-8">
      <h1
        className={cn(
          'text-2xl font-bold',
          !isSuccess ? 'text-destructive' : 'text-green-500',
        )}
      >
        {isSuccess ? 'Success!' : 'Failed!'}
      </h1>

      <div className=" flex items-center gap-4">
        <div className=" relative aspect-video w-1/3 flex-shrink-0">
          <Image
            src={`${product.imagePath}`}
            alt={product.name}
            width="400"
            height={400}
            className=" object-cover"
          />
        </div>
        <div>
          <div className=" text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className=" text-2xl font-bold">{product.name}</h1>
          <div className=" line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4 " asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createVerificationId(product.id)}`}
              >
                Downlaod
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
async function createVerificationId(productId: string) {
  const download = await db.downloadVerification.create({
    data: {
      productId,
      expiresdAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return download.id;
}
