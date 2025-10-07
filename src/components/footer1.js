import React, { useEffect, useRef } from 'react';
import './footer1.css';

const Footer1 = () => {
  const backToTopRef = useRef(null);
  const footerRef = useRef(null);

  // Mostrar/ocultar botão "voltar ao topo" e scroll suave
  useEffect(() => {
    const btn = backToTopRef.current;
    if (!btn) return;

    const onScroll = () => {
      const y = window.scrollY;
      btn.style.opacity = y > 500 ? '1' : '0';
      btn.style.visibility = y > 500 ? 'visible' : 'hidden';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      btn.removeEventListener('click', onClick);
    };
  }, []);

  // Animação de entrada das colunas (IntersectionObserver)
  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const columns = root.querySelectorAll('.footer-column, .footer-brand');
    columns.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    columns.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll suave para âncoras do footer
  useEffect(() => {
    const links = document.querySelectorAll('.footer-link1 a[href^="#"], .footer-social-links1 a[href^="#"]');
    const click = (e) => {
      const href = e.currentTarget.getAttribute('href');
      const id = href?.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    links.forEach((a) => a.addEventListener('click', click));
    return () => links.forEach((a) => a.removeEventListener('click', click));
  }, []);

  return (
    <div className="footer1-container1">
      <footer id="footer-main" ref={footerRef} className="footer-container1">
        <div className="footer-glow-effect" />
        <div className="footer-content-wrapper1">
          <div className="footer-grid1">
            {/* BRAND */}
            <div className="footer-brand">
              <div className="footer-logo-wrapper1">
                <div className="footer-logo-icon1" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 7L13.009 12.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" rx="2" width="20" height="16" />
                    </g>
                  </svg>
                </div>
                <h3 className="footer-logo-text1">Email Classifier AI</h3>
              </div>

              <p className="footer-tagline1">
                Automatize a leitura e a classificação de e-mails com inteligência artificial.
                <br />
                Separe mensagens produtivas das improdutivas com precisão.
              </p>

              <div className="footer-social-links1">
                <a href="https://github.com" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                  <div className="footer-social-link1" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </g>
                    </svg>
                  </div>
                </a>

                <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                  <div className="footer-social-link1" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z" />
                        <circle r="2" cx="4" cy="4" />
                      </g>
                    </svg>
                  </div>
                </a>

                <a href="https://twitter.com" target="_blank" rel="noreferrer noopener" aria-label="Twitter/X">
                  <div className="footer-social-link1" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* LINKS */}
            <div className="footer-column">
              <h4 className="footer-column-title1">Produto</h4>
              <ul className="footer-links-list1">
                <li>
                  <a href="#how-it-works-section">
                    <div className="footer-link1"><span>Início</span></div>
                  </a>
                </li>
                <li>
                  <a href="#demo-section">
                    <div className="footer-link1"><span>Demo</span></div>
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title1">Recursos</h4>
              <ul className="footer-links-list1">
                <li>
                  <a href="#about-section">
                    <div className="footer-link1"><span>Sobre</span></div>
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer noopener">
                    <div className="footer-link1"><span>Documentação</span></div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-divider-wrapper1">
            <div className="footer-divider" />
          </div>

          <div className="footer-bottom1">
            <div className="footer-bottom-content1">
              <p className="footer1-footer-copyright footer-copyright1">
                <span>Made with ❤️</span>
                <span> por Ana Karolina Costa da Silva — 2025</span>
              </p>
              <div className="footer-tech-badge1">
                <span className="footer-tech-badge-dot1" />
                <span className="footer-tech-badge-text">Powered by myself &lt;3</span>
              </div>
            </div>

            <button
              id="footer-back-to-top"
              ref={backToTopRef}
              aria-label="Voltar ao topo"
              className="footer-back-to-top1"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="m5 12 7-7 7 7m-7 7V5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Partículas decorativas (opcional) */}
        <div className="footer-particles" aria-hidden="true">
          <div className="footer-particle1" />
          <div className="footer-particle1" />
          <div className="footer-particle1" />
          <div className="footer-particle1" />
          <div className="footer-particle1" />
          <div className="footer-particle1" />
        </div>
      </footer>
    </div>
  );
};

export default Footer1;
