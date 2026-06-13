import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for rturk.me: the conditions under which this site and its services are provided.',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-ion mb-4">Legal</p>
      <h1 className="font-display text-5xl font-semibold">Terms of Service</h1>
      <p className="text-muted text-sm mt-2 mb-12">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing rturk.me, you agree to these terms. If you do not agree, please do not use
            the site. These terms apply to all visitors, whether or not they engage my services.
          </p>
        </section>

        <section>
          <h2>2. Services</h2>
          <p>
            This site is a portfolio and marketing presence for Ray Turk Development, offering
            WordPress development, web maintenance, hosting, and custom development services.
            The demo sites linked from this portfolio are provided for illustrative purposes only
            and are not intended for commercial use.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            All content on this site — including design, copy, code, and demo projects — is the
            intellectual property of Ray Turk unless otherwise noted. You may not reproduce,
            distribute, or create derivative works without written permission.
          </p>
        </section>

        <section>
          <h2>4. Contact Form &amp; Communications</h2>
          <p>
            Submitting the contact form does not create a client relationship or any contractual
            obligation. A formal engagement begins only upon a signed agreement.
          </p>
        </section>

        <section>
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            This site is provided &ldquo;as is&rdquo; without warranties of any kind. I make no guarantees
            regarding uptime, accuracy of information, or fitness for a particular purpose. Use
            the site at your own risk.
          </p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>
            Ray Turk shall not be liable for any indirect, incidental, or consequential damages
            arising from your use of this site or any services described herein.
          </p>
        </section>

        <section>
          <h2>7. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Ohio, United States, without
            regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>8. Changes to Terms</h2>
          <p>
            These terms may be updated at any time. Continued use of the site after changes
            constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Questions about these terms? Reach me at{' '}
            <a href="mailto:rturk.me@gmail.com">rturk.me@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
