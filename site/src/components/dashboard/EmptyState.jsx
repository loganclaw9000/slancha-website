import React from 'react';

const EmptyState = ({ icon, heading, description, ctaText, onCtaClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-heading">{heading}</h2>
      <p className="empty-state-description">{description}</p>
      {ctaText && onCtaClick && (
        <button className="btn-primary" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;