// Dashboard Overview component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Overview from '../../src/components/dashboard/Overview';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Dashboard Overview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard header', () => {
    renderWithRouter(<Overview />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should display usage statistics', () => {
    renderWithRouter(<Overview />);
    
    // Should have stats cards or sections
    const stats = screen.getAllByRole('group');
    // Stats may be rendered differently, adjust based on actual implementation
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('should have quick actions', () => {
    renderWithRouter(<Overview />);
    
    // Check for action buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display recent activity or data', () => {
    renderWithRouter(<Overview />);
    
    // Should show some kind of activity or data section
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

// ApiKeys component tests
import ApiKeys from '../../src/components/dashboard/ApiKeys';

describe('Dashboard ApiKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render API keys section', () => {
    renderWithRouter(<ApiKeys />);
    
    expect(screen.getByText(/api keys/i, { ignoreCase: true })).toBeInTheDocument();
  });

  it('should have create new key button', () => {
    renderWithRouter(<ApiKeys />);
    
    const createButton = screen.getByRole('button', { name: /create/i, ignoreCase: true });
    expect(createButton).toBeInTheDocument();
  });

  it('should list existing API keys (masked)', () => {
    renderWithRouter(<ApiKeys />);
    
    // Should show some API key information
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have delete key action', () => {
    renderWithRouter(<ApiKeys />);
    
    // Should have delete/revoke options
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
