// Footer component tests
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/Footer';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Footer Component', () => {
  it('should render footer content', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should have copyright text', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  it('should render footer links', () => {
    renderWithRouter(<Footer />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should be semantically correct', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveAttribute('role', 'contentinfo');
  });
});
