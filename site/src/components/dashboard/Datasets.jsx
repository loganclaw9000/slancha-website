import React, { useState } from 'react';
import './Datasets.css';
import usePageMeta from '../../hooks/usePageMeta';

const DATASETS = [
  {
    id: 'ds-001',
    name: 'reasoning-2k',
    description: 'General reasoning and logic problems across 8 categories',
    samples: 2000,
    size: '4.2 MB',
    format: 'jsonl',
    version: 'v3',
    versions: 3,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-31T08:00:00Z',
    tags: ['reasoning', 'logic', 'math'],
    usedIn: { evals: 12, fineTunes: 3 },
    quality: { avgTokens: 342, duplicates: 0.2, langDist: { en: 95, es: 3, fr: 2 } },
    status: 'active',
  },
  {
    id: 'ds-002',
    name: 'code-gen-500',
    description: 'Code generation tasks — Python, TypeScript, Go with test cases',
    samples: 500,
    size: '1.8 MB',
    format: 'jsonl',
    version: 'v2',
    versions: 2,
    createdAt: '2026-03-18T14:30:00Z',
    updatedAt: '2026-03-30T22:00:00Z',
    tags: ['code', 'generation', 'python', 'typescript'],
    usedIn: { evals: 8, fineTunes: 2 },
    quality: { avgTokens: 580, duplicates: 0.0, langDist: { en: 100 } },
    status: 'active',
  },
  {
    id: 'ds-003',
    name: 'summ-3k',
    description: 'Summarization — news articles, technical docs, legal briefs',
    samples: 3000,
    size: '12.1 MB',
    format: 'jsonl',
    version: 'v4',
    versions: 4,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-31T11:30:00Z',
    tags: ['summarization', 'news', 'technical', 'legal'],
    usedIn: { evals: 15, fineTunes: 5 },
    quality: { avgTokens: 1240, duplicates: 0.8, langDist: { en: 88, de: 7, fr: 5 } },
    status: 'active',
  },
  {
    id: 'ds-004',
    name: 'multi-qa-1k',
    description: 'Multilingual question answering across 12 languages',
    samples: 1000,
    size: '3.4 MB',
    format: 'jsonl',
    version: 'v2',
    versions: 2,
    createdAt: '2026-03-20T16:00:00Z',
    updatedAt: '2026-03-31T06:00:00Z',
    tags: ['multilingual', 'qa', 'retrieval'],
    usedIn: { evals: 6, fineTunes: 1 },
    quality: { avgTokens: 210, duplicates: 0.1, langDist: { en: 40, es: 15, fr: 12, de: 10, ja: 8, zh: 5, ko: 3, pt: 2, it: 2, ar: 1, hi: 1, ru: 1 } },
    status: 'active',
  },
  {
    id: 'ds-005',
    name: 'general-5k',
    description: 'General benchmark — broad coverage across all task types',
    samples: 5000,
    size: '18.7 MB',
    format: 'jsonl',
    version: 'v6',
    versions: 6,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
    tags: ['general', 'benchmark', 'mixed'],
    usedIn: { evals: 22, fineTunes: 8 },
    quality: { avgTokens: 445, duplicates: 1.2, langDist: { en: 92, es: 4, fr: 2, de: 2 } },
    status: 'active',
  },
  {
    id: 'ds-006',
    name: 'ft-candidates-800',
    description: 'Curated fine-tuning candidates — high-quality prompt/completion pairs',
    samples: 800,
    size: '2.9 MB',
    format: 'jsonl',
    version: 'v1',
    versions: 1,
    createdAt: '2026-03-28T12:00:00Z',
    updatedAt: '2026-03-30T18:30:00Z',
    tags: ['fine-tuning', 'curated', 'high-quality'],
    usedIn: { evals: 4, fineTunes: 2 },
    quality: { avgTokens: 890, duplicates: 0.0, langDist: { en: 100 } },
    status: 'active',
  },
  {
    id: 'ds-007',
    name: 'customer-support-v1',
    description: 'Auto-curated from live customer support traffic — 2 weeks of data',
    samples: 4200,
    size: '15.3 MB',
    format: 'jsonl',
    version: 'v1',
    versions: 1,
    createdAt: '2026-03-29T00:00:00Z',
    updatedAt: '2026-03-31T00:00:00Z',
    tags: ['auto-curated', 'support', 'live-traffic'],
    usedIn: { evals: 2, fineTunes: 0 },
    quality: { avgTokens: 520, duplicates: 3.4, langDist: { en: 78, es: 12, fr: 5, de: 3, pt: 2 } },
    status: 'processing',
  },
  {
    id: 'ds-008',
    name: 'extraction-financial',
    description: 'Financial document extraction — SEC filings, earnings reports, 10-K forms',
    samples: 1500,
    size: '28.4 MB',
    format: 'jsonl',
    version: 'v2',
    versions: 2,
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-29T14:00:00Z',
    tags: ['extraction', 'financial', 'documents', 'sec'],
    usedIn: { evals: 5, fineTunes: 3 },
    quality: { avgTokens: 2100, duplicates: 0.5, langDist: { en: 100 } },
    status: 'active',
  },
];

const SUMMARY_STATS = {
  totalDatasets: DATASETS.length,
  totalSamples: DATASETS.reduce((s, d) => s + d.samples, 0),
  totalSize: '86.8 MB',
  autoCurated: DATASETS.filter(d => d.tags.includes('auto-curated')).length,
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
    if (selected.size === filtered.length) {
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

  const filtered = DATASETS
    .filter(d => {
      if (!search) return true;
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q));
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
          <div className="dash-stat-value">{SUMMARY_STATS.totalDatasets}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Samples</div>
          <div className="dash-stat-value">{SUMMARY_STATS.totalSamples.toLocaleString()}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Size</div>
          <div className="dash-stat-value">{SUMMARY_STATS.totalSize}</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Auto-Curated</div>
          <div className="dash-stat-value" style={{ color: '#8B5CF6' }}>{SUMMARY_STATS.autoCurated}</div>
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

      <p className="usage-local-note" style={{ marginTop: 24 }}>
        Showing demo data. Datasets will populate from your evaluations and uploaded files.
      </p>
    </div>
  );
}
