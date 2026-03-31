import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { docs } from '../content/docs';
import { posts } from '../content/blog';
import './SearchModal.css';

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>|]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function buildIndex() {
  const items = [];
  for (const doc of docs) {
    items.push({
      type: 'doc',
      title: doc.title,
      section: doc.section,
      slug: doc.slug,
      path: `/docs/${doc.slug}`,
      text: stripMarkdown(doc.body).toLowerCase(),
      titleLower: doc.title.toLowerCase(),
    });
  }
  for (const post of posts) {
    items.push({
      type: 'blog',
      title: post.title,
      section: post.date,
      slug: post.slug,
      path: `/blog/${post.slug}`,
      text: (stripMarkdown(post.body) + ' ' + (post.excerpt || '') + ' ' + (post.tags || []).join(' ')).toLowerCase(),
      titleLower: post.title.toLowerCase(),
    });
  }
  return items;
}

function search(index, query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = [];
  for (const item of index) {
    let score = 0;
    const titleMatch = terms.every(t => item.titleLower.includes(t));
    const bodyMatch = terms.every(t => item.text.includes(t));

    if (titleMatch) score += 10;
    if (bodyMatch) score += 1;

    // Exact phrase bonus
    if (item.titleLower.includes(q)) score += 20;
    if (item.text.includes(q)) score += 3;

    if (score > 0) {
      // Extract snippet around first match
      let snippet = '';
      const idx = item.text.indexOf(terms[0]);
      if (idx >= 0) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(item.text.length, idx + 120);
        snippet = (start > 0 ? '...' : '') + item.text.slice(start, end) + (end < item.text.length ? '...' : '');
      }
      scored.push({ ...item, score, snippet });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12);
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => search(index, query), [index, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const go = useCallback((path) => {
    onClose();
    navigate(path);
  }, [onClose, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      go(results[selected].path);
    }
  };

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search docs and blog..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>

        {query.length >= 2 && (
          <div className="search-results">
            {results.length === 0 ? (
              <div className="search-empty">No results for "{query}"</div>
            ) : (
              results.map((r, i) => (
                <button
                  key={r.path}
                  className={`search-result${i === selected ? ' selected' : ''}`}
                  onClick={() => go(r.path)}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span className={`search-result-badge ${r.type}`}>
                    {r.type === 'doc' ? 'Docs' : 'Blog'}
                  </span>
                  <div className="search-result-body">
                    <span className="search-result-title">{r.title}</span>
                    {r.snippet && <span className="search-result-snippet">{r.snippet}</span>}
                  </div>
                  <svg className="search-result-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              ))
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="search-hints">
            <span className="search-hint">Type to search across documentation and blog posts</span>
            <div className="search-shortcuts">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Open</span>
              <span><kbd>Esc</kbd> Close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
