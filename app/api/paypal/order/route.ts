import { NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "sample_paypal_secret";
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    let valueStr = "20.00";
    try {
      const body = await req.json();
      if (body?.amount) {
        valueStr = Number(body.amount).toFixed(2);
      }
    } catch {
      // Use default
    }

    if (PAYPAL_CLIENT_ID === "test" || PAYPAL_CLIENT_SECRET.includes("sample")) {
      return NextResponse.json({ id: `PAYPAL-DEMO-ORDER-${Date.now()}` });
    }

    const accessToken = await getPayPalAccessToken();
    const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: valueStr,
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || `PayPal order failed status ${res.status}`);
    }

    const order = await res.json();
    return NextResponse.json({ id: order.id });
  } catch (error: any) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json({
      id: `PAYPAL-DEMO-ORDER-${Date.now()}`,
      error: error.message,
    });
  }
}
