import React, { useMemo } from 'react';
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

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);
  usePageMeta(post ? { title: post.title, description: post.excerpt || post.title } : {});

  const related = useMemo(
    () => (post ? getRelatedPosts(post, posts) : []),
    [post]
  );

  const postIndex = post ? posts.findIndex(p => p.slug === slug) : -1;
  const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="page">
      <ArticleJsonLd post={post} />
      <Nav />
      <main className="blog-post-page">
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
            </div>
          </div>
          <div className="blog-post-body">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </article>

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
