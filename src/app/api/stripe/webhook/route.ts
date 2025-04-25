import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Webhook secret from the Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Beautiful HTML email template
const createEmailHTML = (name: string, amount: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Thank You for Your Donation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .container {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 10px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #ffd700;
        border-radius: 10px 10px 0 0;
      }
      .content {
        padding: 20px;
        background-color: white;
        border-radius: 0 0 10px 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #777;
      }
      .quote {
        font-style: italic;
        padding: 15px;
        background-color: #f5f5f5;
        border-left: 4px solid #ffd700;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #3b5998;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank You For Your Donation!</h1>
      </div>
      <div class="content">
        <p>Dear ${name || 'Valued Supporter'},</p>
        
        <p>I am deeply grateful for your generous donation of ${amount} to support our mission. Your contribution helps us continue our important work serving those in need around the world.</p>
        
        <div class="quote">
          "True wealth is not measured by what we have, but by what we give." - Pope Francis
        </div>
        
        <p>Your support is a blessing, and I pray that you too will be blessed in return. Your kindness will help make a real difference in the lives of many people.</p>
        
        <p>Peace and goodness,</p>
        <p><strong>Pope Francis</strong></p>
        
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" class="button">Return to Chat</a>
      </div>
      <div class="footer">
        <p>This is a simulated message for spiritual and educational purposes only.</p>
        <p>Not affiliated with the Vatican or the Holy See.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature') as string;

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the event came from Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed` },
        { status: 400 }
      );
    }

    // Handle specific events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get customer details
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || 'Valued Supporter';
      const amount = `$${(session.amount_total! / 100).toFixed(2)}`;
      
      if (customerEmail) {
        // Send a beautiful thank you email
        try {
          await transporter.sendMail({
            from: `"Pope Francis" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: 'Thank You for Your Generous Donation',
            html: createEmailHTML(customerName, amount),
          });
          
          console.log(`Confirmation email sent to ${customerEmail}`);
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 