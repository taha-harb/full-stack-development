'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import db from '@/app/db/db';
import { redirect } from 'next/navigation';

const fileSchema = z.instanceof(File);
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/'),
);

const addSchema = z.object({
  name: z.string().min(3),
  priceInCents: z.coerce
    .number()
    .int()
    .gt(0, { message: 'The Price should greater than 0' }),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse({
    name: formData.get('name'),
    priceInCents: formData.get('priceInCents'),
  });
  console.log(result.error);
  if (!result.success) {
    return {
      errors: result.error.formErrors.fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  //const data = result.data;

  /* await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer()),
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });
  redirect('/admin/products'); */
}
