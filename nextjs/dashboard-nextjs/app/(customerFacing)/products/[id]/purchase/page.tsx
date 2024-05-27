import db from '@/app/db/db';
import { error } from 'console';
import { notFound } from 'next/navigation';
import React from 'react';
import Stripe from 'stripe';
import CheckOutForm from './_components/CheckOutForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();
  const paymentIntnet = await stripe.paymentIntents.create({
    amount: product?.priceInCents,
    currency: 'USD',
    metadata: { productId: product.id },
  });
  if (paymentIntnet.client_secret == null) {
    throw Error('Failed to create Payment intent');
  }
  return (
    <CheckOutForm
      product={product}
      clientSecret={paymentIntnet.client_secret}
    />
  );
}
