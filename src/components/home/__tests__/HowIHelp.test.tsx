import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowIHelp from '../HowIHelp';

describe('HowIHelp', () => {
  it('renders the section label and heading', () => {
    render(<HowIHelp />);
    expect(screen.getByText('// section.how-i-help')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How I Help', level: 2 })).toBeInTheDocument();
  });

  it('renders all four service titles', () => {
    render(<HowIHelp />);
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Hosting & Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Performance & SEO Audits')).toBeInTheDocument();
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });
});
