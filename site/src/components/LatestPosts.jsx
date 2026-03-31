import { Link } from 'react-router-dom';
import { posts } from '../content/blog/index';
import { useScrollReveal } from '../utils/useScrollReveal';
import './LatestPosts.css';

const FEATURED_COUNT = 3;

function readTime(body) {
  const words = body ? body.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 250));
}

function tagLabel(tag) {
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function LatestPosts() {
  const ref = useScrollReveal();
  const featured = posts.slice(0, FEATURED_COUNT);

  return (
    <section ref={ref} className="latest-posts section-padded reveal" id="blog-preview">
      <div className="latest-posts-inner">
        <span className="section-eyebrow">From the Blog</span>
        <h2 className="section-title">Technical deep dives & industry insights</h2>
        <p className="section-subtitle">
          Our engineering team writes about AI inference optimization, model routing, fine-tuning, and the economics of running LLMs in production.
        </p>

        <div className="latest-posts-grid">
          {featured.map((post, i) => (
            <Link to={`/blog/${post.slug}`} className="latest-post-card" key={post.slug}>
              <div className="latest-post-meta">
                <span className="latest-post-tag">{tagLabel(post.tags[0])}</span>
                <span className="latest-post-read">{readTime(post.body)} min read</span>
              </div>
              <h3 className="latest-post-title">{post.title}</h3>
              <p className="latest-post-excerpt">
                {post.excerpt.length > 160 ? post.excerpt.slice(0, 157) + '...' : post.excerpt}
              </p>
              <span className="latest-post-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </Link>
          ))}
        </div>

        <div className="latest-posts-cta">
          <Link to="/blog" className="btn btn-secondary">
            View all {posts.length} articles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
