import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      // Update the purchase document in Firestore
      const purchaseId = session.metadata.purchaseId;
      if (purchaseId) {
        // First check if it's already been processed
        const purchaseDoc = await getDoc(doc(db, 'purchases', purchaseId));
        
        if (purchaseDoc.exists() && purchaseDoc.data().paymentStatus === 'pending') {
          await updateDoc(doc(db, 'purchases', purchaseId), {
            paymentStatus: 'completed',
            stripeSessionId: sessionId,
            paymentVerifiedAt: new Date().toISOString()
          });
        }
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not completed',
        status: session.payment_status 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
} 