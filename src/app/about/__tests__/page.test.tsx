import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

describe('AboutPage', () => {
  it('renders the header, availability badge, and photo', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    expect(screen.getByText('Open to new projects')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ray Turk' })).toHaveAttribute('src', '/images/Headshot.jpg');
  });

  it('renders the stats callout with the shared profile stats', () => {
    render(<AboutPage />);
    expect(screen.getByText('years')).toBeInTheDocument();
    expect(screen.getByText('sites shipped')).toBeInTheDocument();
    expect(screen.getByText('uptime')).toBeInTheDocument();
  });

  it('renders the My Story section with the existing prose, unchanged', () => {
    render(<AboutPage />);
    expect(screen.getByText('02 — My Story')).toBeInTheDocument();
    expect(
      screen.getByText(/I'm Ray Turk, a full-stack web developer based in Cleveland, Ohio\./)
    ).toBeInTheDocument();
  });

  it('renders the tech ticker, principles, and boundaries list', () => {
    render(<AboutPage />);
    expect(screen.getAllByText('WordPress').length).toBeGreaterThan(0);
    expect(screen.getByText('03 — How I Think About Work')).toBeInTheDocument();
    expect(screen.getByText('Maintainability over cleverness')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: "What I Don't Do" })).toBeInTheDocument();
    expect(
      screen.getByText(/Free, unpaid scope creep/)
    ).toBeInTheDocument();
  });

  it('renders the Career Commits timeline and the contact CTA', () => {
    render(<AboutPage />);
    expect(screen.getByText('04 — Career Commits')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer · Neon Goldfish')).toBeInTheDocument();
    expect(screen.getByText('Have a project or a role in mind? Send a note.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
  });
});
