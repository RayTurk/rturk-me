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
});
