import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`

    const { quantity, unitPrice } = await request.json()

    console.log('Attempting to create Stripe session...')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'AAPL Stock',
            },
            unit_amount: unitPrice,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    })
    console.log('Stripe session created successfully:', session.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Detailed error in /api/payment:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session', details: error.message },
      { status: 500 }
    )
  }
}

