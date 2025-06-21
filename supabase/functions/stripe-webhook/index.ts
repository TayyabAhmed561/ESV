import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        
        // Insert donation record
        const { error } = await supabase
          .from('donations')
          .insert({
            amount: session.amount_total,
            currency: session.currency,
            status: 'completed',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent,
            donor_email: session.customer_email,
            donor_name: session.metadata?.donorName || null,
            species_id: session.metadata?.speciesId || null,
            message: session.metadata?.message || null,
            anonymous: session.metadata?.anonymous === 'true',
          });

        if (error) {
          console.error('Error inserting donation:', error);
          return new Response('Database error', { status: 500 });
        }

        console.log('Donation recorded successfully');
        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object as any;
        
        // Update donation status to failed
        const { error } = await supabase
          .from('donations')
          .update({ status: 'failed' })
          .eq('stripe_session_id', session.id);

        if (error) {
          console.error('Error updating donation status:', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
});