import { NextResponse } from 'next/server';

interface CheckoutBody {
  planId: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  tenantId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

const PLAN_PRICES = {
  starter: { monthly: 29, yearly: 290 },
  pro: { monthly: 79, yearly: 790 },
  enterprise: { monthly: 199, yearly: 1990 },
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { planId, billingCycle, tenantId = 't-1' } = body;

    if (!planId || !PLAN_PRICES[planId]) {
      return NextResponse.json(
        { error: 'Ungültiger Tarif ausgewählt.' },
        { status: 400 }
      );
    }

    const price = PLAN_PRICES[planId][billingCycle || 'monthly'];
    const currency = 'eur';

    // Mocked Stripe Checkout Session ID & simulated redirect URL
    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}?prefilled_email=operator@nordible.com`;

    return NextResponse.json({
      success: true,
      sessionId,
      url: checkoutUrl,
      plan: {
        id: planId,
        billingCycle,
        amount: price,
        currency,
        tenantId,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout session error';
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Stripe-Zahlungssitzung', details: message },
      { status: 500 }
    );
  }
}
