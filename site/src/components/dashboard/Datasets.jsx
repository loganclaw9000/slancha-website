import React, { useState } from 'react';
import './Datasets.css';
import usePageMeta from '../../hooks/usePageMeta';
import { useDatasets } from '../../hooks/useDatasets';

const SUMMARY_STATS = {
  totalDatasets: 0,
  totalSamples: 0,
  totalSize: '0 MB',
  autoCurated: 0,
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function QualityBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="ds-quality-bar">
      <div className="ds-quality-bar-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="ds-quality-bar-track">
        <div className="ds-quality-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function DatasetRow({ ds, selected, onSelect, onExpand, expanded }) {
  return (
    <>
      <tr
        className={`ds-row${selected ? ' selected' : ''}${expanded ? ' expanded' : ''}`}
        onClick={() => onExpand(expanded ? null : ds.id)}
      >
        <td>
          <input
            type="checkbox"
            checked={selected}
            onChange={e => { e.stopPropagation(); onSelect(ds.id); }}
            onClick={e => e.stopPropagation()}
          />
        </td>
        <td>
          <div className="ds-name-cell">
            <span className="ds-name">{ds.name}</span>
            <span className="ds-desc">{ds.description}</span>
          </div>
        </td>
        <td>
          <span className={`ds-status ${ds.status}`}>
            {ds.status === 'processing' && <span className="ds-status-dot pulse" />}
            {ds.status}
          </span>
        </td>
        <td className="ds-mono">{ds.samples.toLocaleString()}</td>
        <td className="ds-mono">{ds.size}</td>
        <td>
          <span className="ds-version-badge">
            {ds.version}
            {ds.versions > 1 && <span className="ds-version-count">({ds.versions})</span>}
          </span>
        </td>
        <td>
          <div className="ds-usage-cell">
            <span title="Eval runs">{ds.usedIn.evals} evals</span>
            <span title="Fine-tune jobs">{ds.usedIn.fineTunes} FT</span>
          </div>
        </td>
        <td className="ds-date">{formatDate(ds.updatedAt)}</td>
      </tr>
      {expanded && (
        <tr className="ds-detail-row">
          <td colSpan={8}>
            <div className="ds-detail-panel">
              <div className="ds-detail-grid">
                <div className="ds-detail-section">
                  <h4>Quality Metrics</h4>
                  <div className="ds-detail-stats">
                    <div className="ds-detail-stat">
                      <span className="ds-detail-stat-value">{ds.quality.avgTokens}</span>
                      <span className="ds-detail-stat-label">Avg tokens/sample</span>
                    </div>
                    <div className="ds-detail-stat">
                      <span className="ds-detail-stat-value">{ds.quality.duplicates}%</span>
                      <span className="ds-detail-stat-label">Duplicates</span>
                    </div>
                    <div className="ds-detail-stat">
                      <span className="ds-detail-stat-value">{ds.format.toUpperCase()}</span>
                      <span className="ds-detail-stat-label">Format</span>
                    </div>
                  </div>
                </div>
                <div className="ds-detail-section">
                  <h4>Language Distribution</h4>
                  <div className="ds-lang-bars">
                    {Object.entries(ds.quality.langDist)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([lang, pct]) => (
                        <QualityBar
                          key={lang}
                          label={lang.toUpperCase()}
                          value={pct}
                          max={100}
                          color={pct > 50 ? '#8B5CF6' : pct > 20 ? '#3B82F6' : '#64748B'}
                        />
                      ))}
                  </div>
                </div>
                <div className="ds-detail-section">
                  <h4>Tags</h4>
                  <div className="ds-tag-list">
                    {ds.tags.map(tag => (
                      <span key={tag} className="ds-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="ds-detail-meta">
                    <span>Created {formatDate(ds.createdAt)}</span>
                    <span>Updated {formatDate(ds.updatedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="ds-detail-actions">
                <button className="ds-btn primary">Run Evaluation</button>
                <button className="ds-btn">Use for Fine-Tuning</button>
                <button className="ds-btn">Download</button>
                <button className="ds-btn">View Samples</button>
                <button className="ds-btn danger">Delete</button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Datasets() {
  usePageMeta({ title: 'Datasets', description: 'Upload, browse, and manage training and evaluation datasets.' });
  const { datasets, loading, error, supabaseConfigured, uploadDataset, deleteDataset, getSummaryStats, refetch } = useDatasets();
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [showUpload, setShowUpload] = useState(false);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(d => d.id)));
    }
  };

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const filtered = datasets
    .filter(d => {
      if (!search) return true;
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.tags?.some(t => t.includes(q));
    })
    .sort((a, b) => {
      let av, bv;
      if (sortBy === 'samples') { av = a.samples; bv = b.samples; }
      else if (sortBy === 'size') { av = parseFloat(a.size); bv = parseFloat(b.size); }
      else if (sortBy === 'updatedAt') { av = a.updatedAt; bv = b.updatedAt; }
      else if (sortBy === 'name') { av = a.name; bv = b.name; }
      else if (sortBy === 'evals') { av = a.usedIn.evals; bv = b.usedIn.evals; }
      else { av = a.updatedAt; bv = b.updatedAt; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }) => (
    <span className={`ds-sort-icon${sortBy === col ? ' active' : ''}`}>
      {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div>
      <div className="ds-header">
        <div>
          <h1 className="dash-page-title">Datasets</h1>
          <p className="dash-page-subtitle">Manage evaluation and fine-tuning datasets. Auto-curated from live traffic or uploaded manually.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(!showUpload)}>Upload Dataset</button>
      </div>

      {/* Summary cards */}
      <div className="dash-cards">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Datasets</div>
          <div className="dash-stat-value">{getSummaryStats().totalDatasets}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Samples</div>
          <div className="dash-stat-value">{getSummaryStats().totalSamples.toLocaleString()}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Size</div>
          <div className="dash-stat-value">{getSummaryStats().totalSize}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Auto-Curated</div>
          <div className="dash-stat-value" style={{ color: '#8B5CF6' }}>{getSummaryStats().autoCurated}</div>
        </div>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="ds-upload-panel">
          <div className="ds-upload-dropzone">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="ds-upload-text">Drag & drop a JSONL file, or <span className="ds-upload-browse">browse</span></p>
            <p className="ds-upload-hint">Supports JSONL, CSV, and Parquet. Max 500MB per file.</p>
          </div>
          <div className="ds-upload-info">
            <h4>Expected format</h4>
            <pre className="ds-upload-code">{`{"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}`}</pre>
            <p className="ds-upload-note">Each line is one training example. Use the standard chat format for best results.</p>
          </div>
        </div>
      )}

      {/* Search + bulk actions */}
      <div className="ds-toolbar">
        <div className="ds-search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="ds-search"
            placeholder="Search datasets by name, description, or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {selected.size > 0 && (
          <div className="ds-bulk-actions">
            <span className="ds-bulk-count">{selected.size} selected</span>
            <button className="ds-btn sm">Merge</button>
            <button className="ds-btn sm">Export</button>
            <button className="ds-btn sm danger">Delete</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="ds-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th onClick={() => handleSort('name')} className="ds-sortable">Name <SortIcon col="name" /></th>
              <th>Status</th>
              <th onClick={() => handleSort('samples')} className="ds-sortable">Samples <SortIcon col="samples" /></th>
              <th onClick={() => handleSort('size')} className="ds-sortable">Size <SortIcon col="size" /></th>
              <th>Version</th>
              <th onClick={() => handleSort('evals')} className="ds-sortable">Used In <SortIcon col="evals" /></th>
              <th onClick={() => handleSort('updatedAt')} className="ds-sortable">Updated <SortIcon col="updatedAt" /></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ds => (
              <DatasetRow
                key={ds.id}
                ds={ds}
                selected={selected.has(ds.id)}
                onSelect={toggleSelect}
                onExpand={setExpanded}
                expanded={expanded === ds.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="ds-empty">
          <p>No datasets match your search.</p>
        </div>
      )}

      {!supabaseConfigured && (
        <div className="eval-demo-banner" style={{ marginTop: 24, padding: 12, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 8, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Demo data — connect Supabase to configure real datasets
        </div>
      )}
    </div>
  );
}
