import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowIHelp from '../HowIHelp';

describe('HowIHelp', () => {
  it('renders the section header and all four service titles', () => {
    render(<HowIHelp />);
    expect(screen.getByText('02 — How I Help')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Performance & SEO Audits')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });
});
