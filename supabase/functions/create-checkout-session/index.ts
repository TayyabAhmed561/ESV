import { corsHeaders } from '../_shared/cors.ts';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

interface CheckoutRequest {
  amount: number;
  currency?: string;
  donorEmail?: string;
  donorName?: string;
  speciesId?: string;
  message?: string;
  anonymous?: boolean;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      amount,
      currency = 'usd',
      donorEmail,
      donorName,
      speciesId,
      message,
      anonymous = false
    }: CheckoutRequest = await req.json();

    // Validate amount (minimum $1.00)
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum donation amount is $1.00' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Endangered Species Conservation Donation',
              description: speciesId 
                ? `Donation to help protect endangered species in Ontario`
                : 'General donation for endangered species conservation',
              images: ['https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=500'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/donation-cancelled`,
      customer_email: donorEmail,
      metadata: {
        donorName: donorName || '',
        speciesId: speciesId || '',
        message: message || '',
        anonymous: anonymous.toString(),
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});