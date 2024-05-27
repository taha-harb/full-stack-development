'use client';
import React, { FormEvent, useState } from 'react';
import {
  Elements,
  useElements,
  useStripe,
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formmatters';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userOrderExists } from '@/app/actions/order';
type CheckOutProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string);
export default function CheckOutForm({ product, clientSecret }: CheckOutProps) {
  return (
    <div className=" w-full  max-w-5xl space-y-8">
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
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
}
function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);
  const [erroMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (elements == null || stripe == null || email == null) {
      return;
    }
    setLoading(true);
    const orderEixsts = await userOrderExists(email, productId);
    if (orderEixsts) {
      setErrorMessage(
        'You have already purchased this product try downloading it from the Orders Page ',
      );
      setLoading(false);
      return;
    }
    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unkown Error');
        }
      })
      .finally(() => setLoading(false));
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {erroMessage && (
            <CardDescription className=" text-destructive">
              {erroMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? 'Purchasing...'
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
