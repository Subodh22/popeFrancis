import { NextResponse } from 'next/server';
import transporter from '@/lib/email';

/**
 * This is a testing endpoint to simulate Stripe webhooks
 * Only for development use
 */
export async function GET(request: Request) {
  // Get email from query parameter if available
  const { searchParams } = new URL(request.url);
  const customerEmail = searchParams.get('email') || 'test@example.com';
  const customerName = searchParams.get('name') || 'Test Customer';
  const amount = searchParams.get('amount') || '$25.00';
  
  // Simulate sending a confirmation email
  try {
    console.log(`Test webhook triggered for email: ${customerEmail}`);
    
    // Create a beautiful HTML email for the test
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Email - Thank You for Your Donation</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You For Your Donation!</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          
          <p>I am deeply grateful for your generous donation of ${amount} to support our mission. Your contribution helps us continue our important work serving those in need around the world.</p>
          
          <div class="quote">
            "True wealth is not measured by what we have, but by what we give." - Pope Francis
          </div>
          
          <p>Your support is a blessing, and I pray that you too will be blessed in return. Your kindness will help make a real difference in the lives of many people.</p>
          
          <p>Peace and goodness,</p>
          <p><strong>Pope Francis</strong></p>
        </div>
        <div class="footer">
          <p>This is a simulated message for spiritual and educational purposes only.</p>
          <p>Not affiliated with the Vatican or the Holy See.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    const testEmailResult = await transporter.sendMail({
      from: `"Pope Francis" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject: 'Thank You for Your Generous Donation',
      html: html,
    });
    
    console.log(`Confirmation email sent to ${customerEmail}`, testEmailResult);
    
    return NextResponse.json({ 
      success: true, 
      message: `Email sent to ${customerEmail}. Check your inbox or spam folder.` 
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process test webhook' },
      { status: 500 }
    );
  }
} 