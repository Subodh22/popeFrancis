import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function GET(request: Request) {
  try {
    // Get the session ID from the query parameter
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get the amount from metadata or calculate from line items
    let amount;
    if (session.metadata?.donation_amount) {
      amount = session.metadata.donation_amount;
    } else if (session.amount_total) {
      amount = `$${(session.amount_total / 100).toFixed(2)}`;
    }

    return NextResponse.json({ 
      success: true,
      amount: amount || null,
      customer: session.customer_details?.email || null
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session details' },
      { status: 500 }
    );
  }
} 