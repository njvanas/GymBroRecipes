import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const successUrl = process.env.SUCCESS_URL || 'http://localhost/success';
const cancelUrl = process.env.CANCEL_URL || 'http://localhost/cancel';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function startCheckout(userId) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials missing');
    throw new Error('Supabase not configured');
  }

  if (!stripeSecret || !priceId) {
    console.log('No Stripe keys, mocking payment success for', userId);
    const { error } = await supabase
      .from('users')
      .update({ is_paid: true })
      .eq('id', userId);
    if (error) {
      console.error('Mock payment update failed', error);
      throw error;
    }
    console.log('User marked paid (mock)');
    return { url: null, mock: true };
  }

  try {
    const stripe = new Stripe(stripeSecret);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: { userId },
    });

    console.log('Checkout session created', session.id);

    // Attempt to verify immediate payment for simplicity
    const retrieved = await stripe.checkout.sessions.retrieve(session.id);
    if (retrieved.payment_status === 'paid') {
      const { error } = await supabase
        .from('users')
        .update({ is_paid: true })
        .eq('id', userId);
      if (error) {
        console.error('Failed to mark user paid', error);
      } else {
        console.log('User marked paid', userId);
      }
    } else {
      console.log('Payment pending for', userId);
    }

    return { url: session.url };
  } catch (err) {
    console.error('Checkout failed', err);
    throw err;
  }
}
