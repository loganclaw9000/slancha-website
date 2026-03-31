import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { posts } from '../content/blog';
import usePageMeta from '../hooks/usePageMeta';
import './Blog.css';

function ArticleJsonLd({ post }) {
  const wordCount = post.body.split(/\s+/).length;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Slancha',
      url: 'https://slancha.ai',
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://slancha.ai/blog/${post.slug}`,
    },
    url: `https://slancha.ai/blog/${post.slug}`,
    wordCount,
    keywords: post.tags.join(', '),
    articleSection: 'AI Engineering',
    inLanguage: 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function getRelatedPosts(currentPost, allPosts, count = 3) {
  return allPosts
    .filter(p => p.slug !== currentPost.slug)
    .map(p => ({
      ...p,
      score: p.tags.filter(t => currentPost.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date))
    .slice(0, count);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/[`*_~]/g, ''),
        id: slugify(match[2].replace(/[`*_~]/g, '')),
      });
    }
  }
  return headings;
}

function TableOfContents({ headings, activeId }) {
  const [collapsed, setCollapsed] = useState(false);

  if (headings.length < 3) return null;

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <button
        className="blog-toc-toggle"
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
      >
        <span className="blog-toc-title">On this page</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 200ms ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {!collapsed && (
        <ul className="blog-toc-list">
          {headings.map(h => (
            <li key={h.id} className={`blog-toc-item${h.level === 3 ? ' blog-toc-sub' : ''}${activeId === h.id ? ' active' : ''}`}>
              <a href={`#${h.id}`} onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>{h.text}</a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

function useScrollSpy(headings) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function ShareButtons({ post }) {
  const [copied, setCopied] = useState(false);
  const url = `https://slancha.ai/blog/${post.slug}`;
  const text = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(url);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div className="blog-share">
      <span className="blog-share-label">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-share-btn"
        aria-label="Share on X (Twitter)"
        title="Share on X"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-share-btn"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <button
        onClick={copyLink}
        className="blog-share-btn"
        aria-label="Copy link"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        )}
      </button>
    </div>
  );
}

function BlogSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      // Post to Supabase newsletter_subscribers or use Formspree
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, _subject: 'Blog Newsletter Subscription', type: 'newsletter' }),
        });
        if (!res.ok) throw new Error('Failed');
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="blog-subscribe">
        <div className="blog-subscribe-success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>You're subscribed! We'll send you new posts.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-subscribe">
      <h3 className="blog-subscribe-title">Get new posts in your inbox</h3>
      <p className="blog-subscribe-desc">Technical deep dives on AI inference, optimization, and deployment. No spam.</p>
      <form className="blog-subscribe-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="blog-subscribe-input"
        />
        <button type="submit" className="blog-subscribe-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="blog-subscribe-error">Something went wrong. Try again.</p>}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);
  usePageMeta(post ? { title: post.title, description: post.excerpt || post.title } : {});

  const related = useMemo(
    () => (post ? getRelatedPosts(post, posts) : []),
    [post]
  );

  const headings = useMemo(() => (post ? extractHeadings(post.body) : []), [post]);
  const activeId = useScrollSpy(headings);

  const wordCount = useMemo(() => (post ? post.body.split(/\s+/).length : 0), [post]);
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const postIndex = post ? posts.findIndex(p => p.slug === slug) : -1;
  const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;

  const markdownComponents = useMemo(() => ({
    h2: ({ children }) => {
      const text = typeof children === 'string' ? children : (Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : c?.props?.children || '').join('') : String(children));
      const id = slugify(text.replace(/[`*_~]/g, ''));
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const text = typeof children === 'string' ? children : (Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : c?.props?.children || '').join('') : String(children));
      const id = slugify(text.replace(/[`*_~]/g, ''));
      return <h3 id={id}>{children}</h3>;
    },
  }), []);

  if (!post) return <Navigate to="/blog" replace />;

  const hasToc = headings.length >= 3;

  return (
    <div className="page">
      <ArticleJsonLd post={post} />
      <Nav />
      <main className={`blog-post-page${hasToc ? ' blog-post-page--toc' : ''}`}>
        <div className="blog-post-layout">
          <article className="blog-post">
            <div className="blog-post-header">
              <Link to="/blog" className="blog-back">&larr; All posts</Link>
              <div className="blog-card-tags">
                {post.tags.map(tag => (
                  <span className="blog-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <h1 className="blog-post-title">{post.title}</h1>
              <div className="blog-post-meta">
                <span>{post.author}</span>
                <span>&middot;</span>
                <span>{post.date}</span>
                <span>&middot;</span>
                <span>{readingTime} min read</span>
              </div>
              <ShareButtons post={post} />
            </div>
            <div className="blog-post-body">
              <ReactMarkdown components={markdownComponents}>{post.body}</ReactMarkdown>
            </div>
          </article>

          {hasToc && (
            <aside className="blog-toc-sidebar">
              <TableOfContents headings={headings} activeId={activeId} />
            </aside>
          )}
        </div>

        {/* Newsletter Subscribe */}
        <BlogSubscribe />

        {/* CTA Banner */}
        <div className="blog-cta-banner">
          <div className="blog-cta-content">
            <h3>Ready to optimize your AI inference?</h3>
            <p>One API endpoint. Zero model selection. Automatic optimization that learns from every request.</p>
          </div>
          <div className="blog-cta-actions">
            <Link to="/signup" className="blog-cta-primary">Start Free</Link>
            <Link to="/demo" className="blog-cta-secondary">See Demo</Link>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <nav className="blog-prev-next">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="blog-prev-next-link">
                <span className="blog-prev-next-label">&larr; Previous</span>
                <span className="blog-prev-next-title">{prevPost.title}</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="blog-prev-next-link blog-prev-next-right">
                <span className="blog-prev-next-label">Next &rarr;</span>
                <span className="blog-prev-next-title">{nextPost.title}</span>
              </Link>
            ) : <div />}
          </nav>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="blog-related">
            <h2 className="blog-related-heading">Related Articles</h2>
            <div className="blog-related-grid">
              {related.map(r => (
                <Link to={`/blog/${r.slug}`} className="blog-related-card" key={r.slug}>
                  <div className="blog-card-tags">
                    {r.tags.slice(0, 2).map(tag => (
                      <span className="blog-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <h3 className="blog-related-title">{r.title}</h3>
                  <p className="blog-related-excerpt">{r.excerpt}</p>
                  <span className="blog-related-meta">{r.author} &middot; {r.date}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
