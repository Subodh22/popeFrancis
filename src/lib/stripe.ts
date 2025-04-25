import { loadStripe, Stripe } from '@stripe/stripe-js';

// Singleton pattern to load Stripe just once
let stripePromise: Promise<Stripe | null>;

// Initialize Stripe with publishable key
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}; 