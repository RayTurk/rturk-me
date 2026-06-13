import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with Ray Turk.' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-muted">Have a project or a role in mind? Send a note.</p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
