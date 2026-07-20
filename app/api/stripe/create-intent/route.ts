import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_sample_key";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  try {
    let amountInCents = 2000;
    try {
      const body = await req.json();
      if (body?.amount && !isNaN(Number(body.amount))) {
        amountInCents = Math.round(Number(body.amount) * 100);
      }
    } catch {
      // Use default if no body sent
    }

    if (!stripeSecretKey || stripeSecretKey.includes("sample")) {
      return NextResponse.json({
        clientSecret: "pi_demo_secret_mock_payment_intent",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe create-intent error:", error);
    // Fallback to mock secret in demo environment
    return NextResponse.json({
      clientSecret: "pi_demo_secret_mock_payment_intent",
      error: error.message,
    });
  }
}
