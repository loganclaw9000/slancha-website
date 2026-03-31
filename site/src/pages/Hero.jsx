import React from 'react';
import { ParticleBackground } from '../components/ParticleBackground';

export const Hero = () => {
  return (
    <section className="hero">
      <ParticleBackground />
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 64px',
        backgroundImage: 'linear-gradient(135deg, rgba(10,10,18,0.8) 0%, rgba(26,26,46,0.6) 100%)',
      }}>
        <div style={{
          maxWidth: '900px',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#A78BFA',
            marginBottom: '24px',
            display: 'inline-block',
            background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
            backgroundSize: '200% auto',
            padding: '8px 24px',
            borderRadius: '9999px',
            animation: 'neon-pulse 3s ease infinite',
          }}>
            AI Engineering Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: '800',
            lineHeight: 1.1,
            marginBottom: '32px',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F5F5F5 0%, #A78BFA 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
          }}>
            Evaluate models. <br />
            Deploy the winner. <br />
            <span style={{
              background: 'linear-gradient(135deg, #14B8A6, #7C3AED)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Repeat.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '20px',
            lineHeight: 1.7,
            color: '#A1A1AA',
            marginBottom: '48px',
            maxWidth: '700px',
            marginInline: 'auto',
          }}>
            Automated model evaluation, one-click deployment, and continuous 
            post-training for AI teams shipping production systems.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button 
              className="btn-primary btn-lg"
              style={{
                animation: 'neon-pulse 2s ease-in-out infinite',
              }}
            >
              Start Free Trial
            </button>
            
            <button className="btn-secondary btn-lg">
              Watch 2-Min Demo
            </button>
          </div>

          {/* Micro-proof */}
          <div style={{
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(124, 58, 237, 0.1)',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#52525B',
              marginBottom: '16px',
            }}>
              Trusted by AI teams at
            </p>
            <div style={{
              display: 'flex',
              gap: '32px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: 0.6,
            }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  style={{
                    width: '120px',
                    height: '40px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#A1A1AA',
                  }}
                >
                  Customer {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
