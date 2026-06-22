import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the wordmark, sitemap links, and services list', () => {
    render(<Footer />);
    expect(screen.getByText('RAY TURK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'work' })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: 'writing' })).toHaveAttribute('href', '/writing');
    expect(screen.getByRole('link', { name: 'about' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
  });

  it('still renders github, linkedin, and colophon links', () => {
    render(<Footer />);
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'colophon' })).toHaveAttribute('href', '/colophon');
  });
});
