import React from 'react';
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

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);
  usePageMeta(post ? { title: post.title, description: post.excerpt || post.title } : {});

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
      </main>
      <Footer />
    </div>
  );
}
