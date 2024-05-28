import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formmatters';
import { Car } from 'lucide-react';

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  imagePath: string;
};

export default function ProductCard({
  id,
  name,
  description,
  priceInCents,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="flex max-w-[20rem] flex-col overflow-hidden">
      <div className="relative aspect-video h-auto w-full border-b-2 border-solid border-gray-200">
        <Image src={imagePath} alt={name} fill />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size={'lg'}>
          <Link href={`products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductSkeleton() {
  return (
    <Card className="flex max-w-[20rem] animate-pulse flex-col overflow-hidden">
      <CardHeader>
        <div className="aspect-video w-full bg-gray-300"></div>
        <CardTitle>
          <div className="h-6 w-3/4 rounded-full bg-gray-300"></div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
      </CardContent>
      <CardFooter>
        <Button disabled className="w-full" size={'lg'}></Button>
      </CardFooter>
    </Card>
  );
}
