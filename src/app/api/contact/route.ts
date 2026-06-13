import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (for demo - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 5) {
    // Max 5 requests per hour
    return false;
  }

  limit.count += 1;
  return true;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  honeypot?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Honeypot check (spam prevention)
    if (data.honeypot) {
      // Silently fail - this is likely a bot
      return NextResponse.json(
        { success: true, message: 'Form submitted successfully' },
        { status: 200 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Prepare email body
    const emailBody = `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'No subject'}

Message:
${data.message}
    `.trim();

    // Option 1: Send via Formspree (popular choice for static sites)
    if (process.env.FORMSPREE_ID) {
      const formspreeResponse = await fetch(
        `https://formspree.io/f/${process.env.FORMSPREE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            subject: data.subject || 'New Contact Form Submission',
          }),
        }
      );

      if (formspreeResponse.ok) {
        return NextResponse.json(
          {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
          },
          { status: 200 }
        );
      }
    }

    // Option 2: Send via WordPress REST API
    if (process.env.WORDPRESS_API_URL && process.env.WORDPRESS_API_TOKEN) {
      const wpResponse = await fetch(
        `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WORDPRESS_API_TOKEN}`,
          },
          body: JSON.stringify({
            post: 0, // Use appropriate post ID or create a custom endpoint
            author_name: data.name,
            author_email: data.email,
            content: emailBody,
          }),
        }
      );

      if (wpResponse.ok) {
        return NextResponse.json(
          {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
          },
          { status: 200 }
        );
      }
    }

    // Option 3: Send via SendGrid or similar (example with SendGrid)
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_TO_EMAIL) {
      const sendgridResponse = await fetch(
        'https://api.sendgrid.com/v3/mail/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: process.env.SENDGRID_TO_EMAIL }],
              },
            ],
            from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@rturk.me' },
            reply_to: { email: data.email },
            subject: data.subject || 'New Contact Form Submission',
            content: [
              {
                type: 'text/plain',
                value: emailBody,
              },
            ],
          }),
        }
      );

      if (sendgridResponse.ok) {
        return NextResponse.json(
          {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
          },
          { status: 200 }
        );
      }
    }

    // Fallback: If no email service is configured
    console.warn('No email service configured. Contact form data:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json(
    { message: 'Contact form API is running' },
    { status: 200 }
  );
}
