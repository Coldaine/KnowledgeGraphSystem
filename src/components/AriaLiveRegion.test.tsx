import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AriaLiveRegion, announceToScreenReader } from './AriaLiveRegion';

describe('AriaLiveRegion Component', () => {
  it('renders an empty live region initially', () => {
    render(<AriaLiveRegion />);
    const region = screen.getByText('', { selector: 'div[aria-live="polite"]' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('');
  });

  it('renders announcement message when called', () => {
    render(<AriaLiveRegion />);

    act(() => {
      announceToScreenReader('Test announcement');
    });

    const region = screen.getByText('Test announcement');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toHaveClass('sr-only');
  });

  it('renders assertive announcement message when specified', () => {
    render(<AriaLiveRegion />);

    act(() => {
      announceToScreenReader('Critical error', 'assertive');
    });

    const region = screen.getByText('Critical error');
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });
});
