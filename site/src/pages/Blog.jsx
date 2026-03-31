import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { posts } from '../content/blog';
import usePageMeta from '../hooks/usePageMeta';
import './Blog.css';

export default function Blog() {
  usePageMeta({ title: 'Blog', description: 'Technical deep dives, tutorials, and insights on AI engineering: model evaluation, deployment strategies, fine-tuning pipelines, and the eval-deploy-train loop.' });
  return (
    <div className="page">
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
        <div className="blog-grid">
          {posts.map(post => (
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
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
