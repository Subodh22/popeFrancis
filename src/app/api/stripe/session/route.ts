import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

// Initialize Stripe directly in the API route
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

    // Get the donation amount from metadata or calculate from line items
    let amount;
    if (session.metadata?.amount) {
      // Amount stored in metadata (from the new implementation)
      amount = `$${parseFloat(session.metadata.amount).toFixed(2)}`;
    } else if (session.metadata?.donation_amount) {
      // Legacy format (from previous implementation)
      amount = session.metadata.donation_amount;
    } else if (session.amount_total) {
      // Calculate from total (fallback)
      amount = `$${(session.amount_total / 100).toFixed(2)}`;
    }

    // Handle recurring vs one-time
    const isSubscription = session.mode === 'subscription';
    if (isSubscription) {
      amount = `${amount}/month`;
    }

    return NextResponse.json({ 
      success: true,
      amount: amount || null,
      customer: session.customer_details?.email || null,
      donationType: session.metadata?.donationType || 'one-time'
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session details' },
      { status: 500 }
    );
  }
} 