import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for rturk.me: how your data is collected and used.',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-ion mb-4">Legal</p>
      <h1 className="font-display text-5xl font-semibold">Privacy Policy</h1>
      <p className="text-muted text-sm mt-2 mb-12">Last updated: March 2026</p>

      <div className="prose prose-invert max-w-none">
        <section>
          <h2>1. Information I Collect</h2>
          <p>
            When you use the contact form on this site, I collect your name, email address, and the
            message you submit. I do not collect any other personal information unless you voluntarily
            provide it.
          </p>
          <p>
            This site may collect anonymized analytics data (page views, referrers, device type) via
            privacy-respecting tools. No personally identifiable information is stored in analytics.
          </p>
        </section>

        <section>
          <h2>2. How I Use Your Information</h2>
          <p>Information submitted through the contact form is used solely to:</p>
          <ul>
            <li>Respond to your inquiry</li>
            <li>Discuss your project or service request</li>
          </ul>
          <p>I will never sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2>3. Cookies</h2>
          <p>
            This site uses minimal cookies required for basic functionality. No third-party advertising
            cookies are set. If analytics are enabled, they use privacy-first tooling that does not
            fingerprint or track users across sites.
          </p>
        </section>

        <section>
          <h2>4. Data Retention</h2>
          <p>
            Contact form submissions are retained only as long as necessary to fulfill the purpose for
            which they were submitted. You may request deletion of your data at any time by emailing{' '}
            <a href="mailto:rturk.me@gmail.com">rturk.me@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>5. External Links</h2>
          <p>
            This site links to external sites (GitHub, LinkedIn, demo projects). I am not responsible
            for the privacy practices of those sites and encourage you to review their policies.
          </p>
        </section>

        <section>
          <h2>6. Changes to This Policy</h2>
          <p>
            This policy may be updated occasionally. The &ldquo;Last updated&rdquo; date at the top reflects the
            most recent revision. Continued use of the site constitutes acceptance of the current policy.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Questions about this policy? Reach me at{' '}
            <a href="mailto:rturk.me@gmail.com">rturk.me@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
