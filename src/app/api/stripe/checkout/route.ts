import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

// Initialize Stripe directly in the API route to ensure server-side only execution
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const { amount, donationType } = await request.json();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) < 1) {
      return NextResponse.json(
        { error: 'Please provide a valid donation amount' },
        { status: 400 }
      );
    }

    // Convert amount to cents
    const amountInCents = Math.floor(Number(amount) * 100);
    
    // Get URL origin
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    const isSubscription = donationType === 'monthly';
    
    // Create params based on donation type
    const params = isSubscription
      ? {
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Monthly Support - Caritas Internationalis',
                  description: '100% of profits from your contribution support Caritas Internationalis charitable works',
                },
                unit_amount: amountInCents,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/pro/cancel`,
          metadata: {
            donationType: 'monthly',
            amount: amount.toString(),
          },
        }
      : {
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Support - Caritas Internationalis',
                  description: '100% of profits from your contribution support Caritas Internationalis charitable works',
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/pro/cancel`,
          metadata: {
            donationType: 'one-time',
            amount: amount.toString(),
          },
        };
    
    // Create session
    const session = await stripe.checkout.sessions.create(params as any);
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Something went wrong when creating checkout session' },
      { status: 500 }
    );
  }
} 