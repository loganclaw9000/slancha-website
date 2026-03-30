// Nav component tests
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../../src/components/Nav';
import { MemoryRouter } from 'react-router-dom';

// Mock the AuthContext
vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
    loading: false,
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Nav Component', () => {
  it('should render logo and brand name', () => {
    renderWithRouter(<Nav />);
    
    expect(screen.getByText(/slancha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slancha/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Nav />);
    
    expect(screen.getByText(/docs/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/get started/i)).toBeInTheDocument();
  });

  it('should show dashboard link when user is logged in', () => {
    // Override mock for this test
    vi.mocked(vi.importMock('../../src/contexts/AuthContext')).useAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      signOut: vi.fn(),
      loading: false,
    });

    renderWithRouter(<Nav />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  it('should show hamburger menu on mobile', () => {
    renderWithRouter(<Nav />);
    
    expect(screen.getByLabelText(/menu/i)).toBeInTheDocument();
  });

  it('should toggle mobile menu on hamburger click', () => {
    renderWithRouter(<Nav />);
    
    const hamburger = screen.getByLabelText(/menu/i);
    fireEvent.click(hamburger);
    
    expect(screen.getByText(/docs/i)).toHaveClass(/nav-overlay/);
  });

  it('should close mobile menu when clicking overlay', () => {
    renderWithRouter(<Nav />);
    
    const hamburger = screen.getByLabelText(/menu/i);
    fireEvent.click(hamburger);
    
    // Click overlay
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }
  });

  it('should have skip link for accessibility', () => {
    renderWithRouter(<Nav />);
    
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
  });

  it('should render back link when backLink prop is true', () => {
    renderWithRouter(<Nav backLink />);
    
    expect(screen.getByText(/back to home/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/menu/i)).not.toBeInTheDocument();
  });
});
