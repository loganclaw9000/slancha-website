// Hero component tests
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '../../src/components/Hero';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Hero Component', () => {
  it('should render heading text', () => {
    renderWithRouter(<Hero />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render CTA buttons', () => {
    renderWithRouter(<Hero />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have proper semantic HTML', () => {
    renderWithRouter(<Hero />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA attributes', () => {
    renderWithRouter(<Hero />);
    
    // Check for aria labels on interactive elements
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });
});
