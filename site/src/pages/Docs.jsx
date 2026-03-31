import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { docs, docSections } from '../content/docs';
import usePageMeta from '../hooks/usePageMeta';
import './Docs.css';

export default function Docs() {
  const { slug } = useParams();
  const currentSlug = slug || 'getting-started';
  const doc = docs.find(d => d.slug === currentSlug);
  usePageMeta(doc ? { title: `${doc.title} — Docs`, description: `Slancha documentation: ${doc.title}. Learn how to evaluate, deploy, and improve AI models with the Slancha platform.` } : {});

  if (slug && !doc) return <Navigate to="/docs" replace />;

  return (
    <div className="page">
      <Nav />
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-inner">
            {docSections.map(section => (
              <div className="docs-section" key={section.name}>
                <h3 className="docs-section-title">{section.name}</h3>
                <ul className="docs-nav-list">
                  {section.slugs.map(s => {
                    const d = docs.find(doc => doc.slug === s);
                    if (!d) return null;
                    return (
                      <li key={s}>
                        <Link
                          to={`/docs/${s}`}
                          className={`docs-nav-link${currentSlug === s ? ' active' : ''}`}
                        >
                          {d.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <main className="docs-content">
          {doc && (
            <article className="docs-article">
              <ReactMarkdown>{doc.body}</ReactMarkdown>
            </article>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
