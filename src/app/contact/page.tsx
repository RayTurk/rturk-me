import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import SectionLabel from '@/components/layout/SectionLabel';

export const metadata: Metadata = { title: 'Contact', description: 'Get in touch with Ray Turk.' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <SectionLabel label="page.contact" />
      <h1 className="mt-2 font-display text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-muted">Have a project or a role in mind? Send a note.</p>
      <section className="mt-10 border-t border-ion pt-10">
        <ContactForm />
      </section>
    </div>
  );
}
