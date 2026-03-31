import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Loading CSS chunk')
    );
    return { hasError: true, isChunkError };
  }

  handleRetry = () => {
    if (this.state.isChunkError) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, isChunkError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-primary, #fff)',
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {this.state.isChunkError ? 'New version available' : 'Something went wrong'}
          </h2>
          <p style={{ color: 'var(--text-secondary, #9CA3AF)', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {this.state.isChunkError
              ? 'The site has been updated since you last loaded it. Click below to refresh.'
              : 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'var(--accent, #3B82F6)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              cursor: 'pointer',
            }}
          >
            {this.state.isChunkError ? 'Refresh page' : 'Try again'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
