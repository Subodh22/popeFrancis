import { loadStripe } from '@stripe/stripe-js';
import type { Stripe as StripeClient } from '@stripe/stripe-js';
import { Stripe as StripeServer } from 'stripe';

// Singleton pattern to load Stripe just once (client-side)
let stripePromise: Promise<StripeClient | null>;

// Initialize Stripe with publishable key (client-side)
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}; 

// Server-side Stripe instance for API routes
// Only initialize on the server side to avoid errors in the browser
export const stripe = typeof window === 'undefined' 
  ? new StripeServer(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-03-31.basil', 
    })
  : null; 