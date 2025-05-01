import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Email configuration is missing');
    }

    const { userEmail, stockName, quantity, totalAmount } = await request.json();

    if (!userEmail || !stockName || !quantity || totalAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: `Breeze Stock Trading <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Stock Purchase Confirmation - Breeze',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #8B5CF6;">Stock Purchase Confirmation</h2>
          <p>Your stock purchase has been successfully processed.</p>
          <div style="background-color: #ffdddd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d92828;">Alert:</h3>
            <p>You are trying to buy stocks. Please ensure you have sufficient funds in your account.</p>
          </div>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6D28D9;">Transaction Details:</h3>
            <p><strong>Stock:</strong> ${stockName}</p>
            <p><strong>Quantity Purchased:</strong> ${quantity}</p>
            <p><strong>Total Amount Paid:</strong> ₹${totalAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
              timeZone: 'Asia/Kolkata',
            })}</p>
          </div>
          <p style="color: #666;">Thank you for investing with Breeze. Your investment journey begins here!.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase confirmation email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email', 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 