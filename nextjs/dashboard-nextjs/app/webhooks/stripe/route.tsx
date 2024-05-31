import db from '@/app/db/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_EMAIL_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string,
  );
  if (event.type === 'charge.succeeded' || event.type === 'charge.updated') {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCent = charge.amount;
    const product = await db.product.findUnique({ where: { id: productId } });
    if (product == null || email == null) {
      return new NextResponse('Bad request', { status: 400 });
    }
    const userFields = {
      email,
      Order: {
        create: {
          productId,
          pricePaidInCent,
        },
      },
    };
    await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { Order: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    const downloadVerification = db.downloadVerification.create({
      data: {
        productId,
        expiresdAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: [`t.h.harb@gmail.com`],
      subject: 'Order Confirmation',
      react: <h1>xxx test test</h1>,
    });
  }
  return new NextResponse();
}
