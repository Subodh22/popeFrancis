import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // Keep original API version
});

export async function POST(req: Request) {
  try {
    // Get donation amount from request body
    const body = await req.json();
    let amount = body.amount || 25; // Default to $25 if not provided
    
    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }
    
    // Convert to cents for Stripe (Stripe uses smallest currency unit)
    const unitAmount = Math.round(amount * 100);
    
    // Build absolute URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pope-francis.vercel.app/';
    const successUrl = `${baseUrl}/pro/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pro/cancel`;
    
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
            unit_amount: unitAmount, // Dynamic amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Essential options for email collection
      billing_address_collection: 'required',
      metadata: {
        product_name: 'Pope Francis Pro',
        donation_for: 'Pope Francis\'s favorite foundation',
        donation_amount: `$${amount.toFixed(2)}`
      },
      // Add a custom URL to return to from the cancel page
      custom_text: {
        submit: {
          message: `Support Pope Francis ($${amount.toFixed(2)})`
        }
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