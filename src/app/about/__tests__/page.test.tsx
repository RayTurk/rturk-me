import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../page';

describe('AboutPage', () => {
  it('renders the page label, heading, availability badge, and photo', () => {
    render(<AboutPage />);
    expect(screen.getByText('// page.about')).toBeInTheDocument();
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

  it('renders the My Story section label, heading, and prose', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.my-story')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Story', level: 2 })).toBeInTheDocument();
    expect(
      screen.getByText(/I'm Ray Turk, a full-stack web developer based in Cleveland, Ohio\./)
    ).toBeInTheDocument();
  });

  it('renders the principles section label, heading, and card titles', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.principles')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I Think About Work', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Maintainability over cleverness')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: "What I Don't Do" })).toBeInTheDocument();
    expect(screen.getByText(/Free, unpaid scope creep/)).toBeInTheDocument();
  });

  it('renders the Career Commits section label, heading, and contact CTA', () => {
    render(<AboutPage />);
    expect(screen.getByText('// section.career')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Career Commits', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer · Neon Goldfish')).toBeInTheDocument();
    expect(screen.getByText('Have a project or a role in mind? Send a note.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
  });
});
