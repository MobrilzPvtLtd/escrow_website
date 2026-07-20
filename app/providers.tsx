'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample_key';

const stripePromise = loadStripe(stripePublishableKey);

const paypalClientId =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider
        options={{
          clientId: paypalClientId,
          currency: 'USD',
        }}
      >
        {children}
      </PayPalScriptProvider>
    </Elements>
  );
}
