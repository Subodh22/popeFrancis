import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // Keep original API version
});

export async function POST() {
  try {
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pope Francis Pro',
              description: '100% of profits go to Pope Francis\'s favorite foundation',
              images: ['https://www.vaticannews.va/content/dam/vaticannews/agenzie/images/afp/2022/10/06/09/1665049251361.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.1500.844.jpeg'],
            },
            unit_amount: 2500, // $25.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pro/cancel`,
      // Essential options for email collection
      billing_address_collection: 'required',
      metadata: {
        product_name: 'Pope Francis Pro',
        donation_for: 'Pope Francis\'s favorite foundation'
      }
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 