import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionLabel from '../SectionLabel';

describe('SectionLabel', () => {
  it('renders the comment-style label text', () => {
    render(<SectionLabel label="section.my-story" />);
    expect(screen.getByText('// section.my-story')).toBeInTheDocument();
  });

  it('renders the ghost number when provided', () => {
    render(<SectionLabel label="section.my-story" number="02" />);
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('omits the ghost number when number is not provided', () => {
    const { container } = render(<SectionLabel label="page.about" />);
    expect(container.querySelector('span[aria-hidden]')).toBeNull();
  });
});
