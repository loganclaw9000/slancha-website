import React from 'react';

function LogoSlot({ name }) {
  return (
    <div className="logo-placeholder" aria-label={`${name} logo placeholder`} aria-hidden="true">
      <span>{name}</span>
    </div>
  );
}

function TestimonialCard({ quote, author, role, avatarUrl }) {
  const initial = author ? author.charAt(0).toUpperCase() : '?';
  
  return (
    <blockquote className="testimonial-card">
      <span className="quote-icon">"</span>
      <p className="testimonial-quote">{quote}</p>
      <div className="author-block">
        <div className="author-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${author} avatar`} />
          ) : (
            <span className="initial">{initial}</span>
          )}
        </div>
        <div className="author-info">
          <cite className="author-name">{author}</cite>
          <span className="author-role">{role}</span>
        </div>
      </div>
    </blockquote>
  );
}

function SocialProof() {
  return (
    <section className="social-proof">
      <div className="social-proof-container">
        {/* Trusted By Logos */}
        <div className="social-proof-logos">
          <span className="social-proof-label">TRUSTED BY</span>
          <div className="logo-grid">
            <LogoSlot name="Company A" />
            <LogoSlot name="Company B" />
            <LogoSlot name="Company C" />
            <LogoSlot name="Company D" />
            <LogoSlot name="Company E" />
            <LogoSlot name="Company F" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="social-proof-testimonials">
          <span className="social-proof-label">WHAT ENGINEERS SAY</span>
          <div className="testimonial-carousel">
            <TestimonialCard
              quote="Slancha cut our inference costs by 60% while improving latency. The auto-tuning is magic."
              author="Alex Chen"
              role="ML Engineer, TechCorp"
              avatarUrl="/avatars/alex.jpg"
            />
            <TestimonialCard
              quote="Finally, an eval-to-deploy loop that doesn't require a PhD to set up. Our team shipped in days, not months."
              author="Sarah Park"
              role="Lead AI Engineer, StartupXYZ"
              avatarUrl="/avatars/sarah.jpg"
            />
            <TestimonialCard
              quote="The pilot program saved us $200k in GPU costs in the first quarter. Slancha pays for itself."
              author="Marcus Johnson"
              role="CTO, DataFirst Inc"
              avatarUrl="/avatars/marcus.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialProof;
