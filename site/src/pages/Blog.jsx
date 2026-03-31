import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { posts } from '../content/blog';
import usePageMeta from '../hooks/usePageMeta';
import './Blog.css';

const TAG_LABELS = {
  'tutorial': 'Tutorials',
  'comparison': 'Comparisons',
  'engineering': 'Engineering',
  'architecture': 'Architecture',
  'fine-tuning': 'Fine-Tuning',
  'inference': 'Inference',
  'cost-optimization': 'Cost Optimization',
  'strategy': 'Strategy',
  'router': 'Router',
  'platform': 'Platform',
};

function BlogJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Slancha Blog',
    description: 'Technical deep dives, tutorials, and insights on AI engineering: model evaluation, deployment strategies, fine-tuning pipelines, and the eval-deploy-train loop.',
    url: 'https://slancha.ai/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Slancha',
      url: 'https://slancha.ai',
    },
    inLanguage: 'en-US',
    blogPost: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://slancha.ai/blog/${post.slug}`,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author },
      keywords: post.tags.join(', '),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Blog() {
  const [activeTag, setActiveTag] = useState(null);

  const filterTags = useMemo(() => {
    const tagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (TAG_LABELS[tag]) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, []);

  const filteredPosts = activeTag
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts;

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  usePageMeta({ title: 'Blog', description: 'Technical deep dives, tutorials, and insights on AI engineering: model evaluation, deployment strategies, fine-tuning pipelines, and the eval-deploy-train loop.' });
  return (
    <div className="page">
      <BlogJsonLd />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" className="blog-page">
        <div className="blog-header">
          <div className="blog-title-row">
            <h1 className="blog-title">Blog</h1>
            <a href="/rss.xml" className="blog-rss" title="RSS Feed" aria-label="RSS Feed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>
            </a>
          </div>
          <p className="blog-subtitle">Thinking on AI engineering, model optimization, and closing the loop.</p>
        </div>

        <div className="blog-filters">
          <button
            className={`blog-filter-tag${!activeTag ? ' active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            All ({posts.length})
          </button>
          {filterTags.map(tag => (
            <button
              key={tag}
              className={`blog-filter-tag${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="blog-featured">
            <div className="blog-featured-badge">Latest</div>
            <div className="blog-card-tags">
              {featured.tags.map(tag => (
                <span className="blog-tag" key={tag}>{tag}</span>
              ))}
            </div>
            <h2 className="blog-featured-title">{featured.title}</h2>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-card-meta">
              <span>{featured.author}</span>
              <span>{featured.date}</span>
              <span>{Math.max(1, Math.round(featured.body.split(/\s+/).length / 200))} min read</span>
            </div>
          </Link>
        )}

        <div className="blog-grid">
          {rest.map(post => (
            <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div className="blog-card-tags">
                {post.tags.map(tag => (
                  <span className="blog-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>{Math.max(1, Math.round(post.body.split(/\s+/).length / 200))} min read</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="blog-empty">
            <p>No posts found for this topic.</p>
            <button className="blog-filter-tag active" onClick={() => setActiveTag(null)}>Show all posts</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
