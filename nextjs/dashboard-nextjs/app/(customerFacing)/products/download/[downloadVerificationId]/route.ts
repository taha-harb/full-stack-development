import db from '@/app/db/db';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } },
) {
  console.log(downloadVerificationId[0]);
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresdAt: { gt: new Date() } },
    select: {
      product: { select: { filePath: true, name: true } },
    },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL(`/products/download/expired`, req.url),
    );
  }
  try {
    const { size } = await fs.stat(data.product.filePath);
    const file = await fs.readFile(data.product.filePath);
    const extension = data.product.filePath.split('.').pop();

    return new NextResponse(file, {
      headers: {
        'content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
        'content-length': size.toString(),
      },
    });
  } catch (err) {
    console.log(err);
    return notFound();
  }
}
