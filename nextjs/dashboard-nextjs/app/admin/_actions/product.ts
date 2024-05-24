'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import db from '@/app/db/db';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
  description: z.string().min(1),
  file: fileSchema.refine(
    (file) => file.size > 0,
    'The file should not be Empty',
  ),
  image: imageSchema.refine(
    (file) => file.type.startsWith('image/'),
    'The file should be image',
  ),
});
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  console.log(result.error);
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  await fs.mkdir('products', { recursive: true });
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
  revalidatePath('/');
  revalidatePath('/products');
  redirect('/admin/products');
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  console.log(result.error);
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    await fs.mkdir('products', { recursive: true });
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.mkdir('public/products', { recursive: true });
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer()),
    );
  }
  await db.product.update({
    where: { id },
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });
  revalidatePath('/');
  revalidatePath('/products');
  redirect('/admin/products');
}
export async function toggleProductAvailablity(
  id: string,
  isAvailableForPurchase: boolean,
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
  revalidatePath('/');
  revalidatePath('/products');
}
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (!product) return notFound();
  fs.unlink(product.filePath);
  fs.unlink(`public${product.imagePath}`);
  revalidatePath('/');
  revalidatePath('/products');
}
