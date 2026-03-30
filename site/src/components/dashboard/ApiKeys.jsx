import React, { useState } from 'react';
import EmptyState from './EmptyState';

const ApiKeys = () => {
  // Mock data - in real app this would come from API
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key-1',
      name: 'Production API Key',
      prefix: 'sk-abc123...',
      createdAt: '2026-03-29',
      status: 'active'
    },
    {
      id: 'key-2',
      name: 'Development API Key',
      prefix: 'sk-def456...',
      createdAt: '2026-03-28',
      status: 'active'
    }
  ]);

  const handleRevoke = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (apiKeys.length === 0) {
    return (
      <EmptyState
        icon="🔑"
        heading="No API keys yet"
        description="Create your first API key to start using our platform."
        ctaText="Create API Key"
        onCtaClick={() => console.log('Create API key clicked')}
      />
    );
  }

  return (
    <div className="api-keys">
      <div className="api-keys-header">
        <h2>API Keys</h2>
        <button className="btn-primary">Create Key</button>
      </div>
      
      <div className="api-keys-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td>{key.name}</td>
                <td><code>{key.prefix}</code></td>
                <td>{key.createdAt}</td>
                <td><span className="status-active">Active</span></td>
                <td>
                  <button 
                    className="btn-secondary btn-small"
                    onClick={() => handleCopy(key.prefix)}
                  >
                    Copy
                  </button>
                  <button 
                    className="btn-danger btn-small"
                    onClick={() => handleRevoke(key.id)}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeys;