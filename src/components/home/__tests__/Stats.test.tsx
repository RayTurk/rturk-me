import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

describe('Stats', () => {
  it('renders all four stat labels', () => {
    render(<Stats />);
    expect(screen.getByText('years')).toBeInTheDocument();
    expect(screen.getByText('sites shipped')).toBeInTheDocument();
    expect(screen.getByText('uptime')).toBeInTheDocument();
    expect(screen.getByText('avg lighthouse score')).toBeInTheDocument();
  });
});
