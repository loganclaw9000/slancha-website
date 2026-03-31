import { useEffect } from 'react';

const SITE_NAME = 'Slancha';
const DEFAULT_DESCRIPTION = 'End-to-end AI inference platform. One API endpoint — Slancha automatically routes, fine-tunes, and optimizes your models behind the scenes. Better accuracy, lower cost, zero ML overhead.';

/**
 * Sets document title and meta description for the current page.
 * @param {{ title?: string, description?: string }} opts
 */
export default function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — AI Inference That Improves Itself`;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', fullTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', desc);
  }, [title, description]);
}
