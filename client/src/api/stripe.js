import { loadStripe } from '@stripe/stripe-js';

// Support bothREACT_APP and VITE naming conventions to address user concern
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Stripe Publishable Key is missing!");
}

export const stripePromise = loadStripe(publishableKey);
