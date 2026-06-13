'use client';

import { useState } from 'react';

interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

interface FormData {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  honeypot: string;
}

const serviceOptions = [
  'Web Development',
  'WordPress Customization',
  'Full-Stack Application',
  'Consulting',
  'Other',
];

const budgetOptions = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
];

const inputClass =
  'w-full bg-panel border border-hairline rounded-lg text-signal placeholder:text-faint focus:border-ion focus:outline-none px-4 py-3 transition-colors';

const ContactForm = () => {
  const [formState, setFormState] = useState<ContactFormState>({ status: 'idle' });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.budget) {
      newErrors.budget = 'Please select a budget range';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (formData.honeypot) {
      // Honeypot filled — likely a bot, silently fail
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormState({ status: 'error', message: 'Please fix the errors above' });
      return;
    }

    setFormState({ status: 'loading' });

    try {
      // POST form-encoded to / for Netlify Forms detection
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormState({
        status: 'success',
        message: "Thanks for reaching out! I'll get back to you soon.",
      });

      setFormData({ name: '', email: '', service: '', budget: '', message: '', honeypot: '' });

      setTimeout(() => {
        setFormState({ status: 'idle' });
      }, 5000);
    } catch {
      setFormState({
        status: 'error',
        message: 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} name="contact" className="space-y-6">
      {/* Required by Netlify for JS-rendered forms */}
      <input type="hidden" name="form-name" value="contact" />

      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block font-mono text-xs text-muted">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`${inputClass}${errors.name ? ' border-red-500/60' : ''}`}
          placeholder="Ray Turk"
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block font-mono text-xs text-muted">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`${inputClass}${errors.email ? ' border-red-500/60' : ''}`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Service */}
      <div className="space-y-1.5">
        <label htmlFor="service" className="block font-mono text-xs text-muted">
          Service Interested In
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={`${inputClass} appearance-none cursor-pointer${errors.service ? ' border-red-500/60' : ''}`}
        >
          <option value="">Select a service...</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="text-xs text-red-400">{errors.service}</p>
        )}
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <label htmlFor="budget" className="block font-mono text-xs text-muted">
          Budget Range
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className={`${inputClass} appearance-none cursor-pointer${errors.budget ? ' border-red-500/60' : ''}`}
        >
          <option value="">Select a range...</option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p className="text-xs text-red-400">{errors.budget}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="block font-mono text-xs text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`${inputClass} resize-none${errors.message ? ' border-red-500/60' : ''}`}
          placeholder="Tell me about your project..."
        />
        {errors.message && (
          <p className="text-xs text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Status Messages */}
      {formState.status === 'success' && (
        <div className="rounded-lg border border-ion/30 bg-ion/10 px-4 py-3">
          <p className="text-sm text-ion">{formState.message}</p>
        </div>
      )}
      {formState.status === 'error' && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{formState.message}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={formState.status === 'loading'}
        className="bg-ion text-void font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
