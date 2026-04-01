import React, { useState, useEffect } from 'react';

export default function ConfigPreview({ yaml, snapshots, snapshotsLoading, onSaveSnapshot, onFetchSnapshots }) {
  const [copied, setCopied] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (showHistory && onFetchSnapshots) {
      onFetchSnapshots();
    }
  }, [showHistory, onFetchSnapshots]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = yaml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slancha-router-config.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    await onSaveSnapshot(snapshotName || undefined);
    setSnapshotName('');
  };

  return (
    <div className="dash-config-preview">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Configuration YAML</h2>
          <p className="dash-section-desc">Live preview of your vLLM Semantic Router configuration.</p>
        </div>
        <div className="dash-config-actions">
          <button className="dash-btn-sm" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy YAML'}
          </button>
          <button className="dash-btn-sm" onClick={handleDownload}>Download</button>
          <button className="dash-btn-sm" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Hide History' : 'Snapshots'}
          </button>
        </div>
      </div>

      <div className="dash-yaml-container">
        <pre className="dash-yaml-pre"><code>{yaml}</code></pre>
      </div>

      <div className="dash-snapshot-save">
        <input
          className="dash-form-input"
          type="text"
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
          placeholder="Snapshot name (optional)"
          style={{ flex: 1 }}
        />
        <button className="dash-btn-sm dash-btn-primary" onClick={handleSave}>Save Snapshot</button>
      </div>

      {showHistory && (
        <div className="dash-snapshot-history">
          <h3 className="dash-section-title" style={{ fontSize: 14, marginBottom: 12 }}>Saved Snapshots</h3>
          {snapshotsLoading && <p className="dash-section-desc">Loading...</p>}
          {!snapshotsLoading && snapshots.length === 0 && (
            <p className="dash-section-desc">No snapshots saved yet.</p>
          )}
          {snapshots.map(s => (
            <div key={s.id} className="dash-snapshot-item">
              <div className="dash-snapshot-info">
                <span className="dash-snapshot-name">{s.name}</span>
                <span className="dash-snapshot-date">{new Date(s.created_at).toLocaleString()}</span>
              </div>
              <button
                className="dash-btn-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(s.yaml_content);
                  } catch { /* ignore */ }
                }}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
