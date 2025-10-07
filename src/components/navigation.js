import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './navigation.css';

const Navigation = ({ rootClassName = '' }) => {
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const actionsRef = useRef(null);
  const overlayRef = useRef(null);
  const navRef = useRef(null);

  // scroll suave para âncoras internas
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    const onClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      const id = href?.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    links.forEach((a) => a.addEventListener('click', onClick));
    return () => links.forEach((a) => a.removeEventListener('click', onClick));
  }, []);

  // comportamento de header (estado scrolled)
  useEffect(() => {
    const nav = navRef.current;
    const onScroll = () => {
      if (!nav) return;
      if (window.pageYOffset > 20) nav.classList.add('navigation-scrolled');
      else nav.classList.remove('navigation-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // mobile menu
  const openMenu = () => {
    toggleRef.current?.setAttribute('aria-expanded', 'true');
    menuRef.current?.classList.add('navigation-menu-active');
    actionsRef.current?.classList.add('navigation-actions-active');
    overlayRef.current?.classList.add('navigation-mobile-overlay-active');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    toggleRef.current?.setAttribute('aria-expanded', 'false');
    menuRef.current?.classList.remove('navigation-menu-active');
    actionsRef.current?.classList.remove('navigation-actions-active');
    overlayRef.current?.classList.remove('navigation-mobile-overlay-active');
    document.body.style.overflow = '';
  };
  const toggleMenu = () => {
    const expanded = toggleRef.current?.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  };

  // fechar ao redimensionar p/ desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 991) closeMenu();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // fechar com ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && toggleRef.current?.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // trap de foco simples dentro do menu mobile
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Tab' || toggleRef.current?.getAttribute('aria-expanded') !== 'true') return;
      const focusables = menuRef.current?.querySelectorAll('a[href]') ?? [];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    menuRef.current?.addEventListener('keydown', onKeyDown);
    return () => menuRef.current?.removeEventListener('keydown', onKeyDown);
  }, []);

  // fechar ao clicar nos links (somente mobile)
  useEffect(() => {
    const links = menuRef.current?.querySelectorAll('.navigation-link') ?? [];
    const handler = () => { if (window.innerWidth <= 991) closeMenu(); };
    links.forEach((link) => link.addEventListener('click', handler));
    return () => links.forEach((link) => link.removeEventListener('click', handler));
  }, []);

  return (
    <div className={`navigation-container1 ${rootClassName}`}>
      <nav id="navigation-main" ref={navRef} className="navigation">
        <div className="navigation-container">
          <a href="/" aria-label="Email Classifier AI - Home">
            <div className="navigation-logo">
              <div className="navigation-logo-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 7L13.009 12.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" rx="2" width="20" height="16" />
                  </g>
                </svg>
              </div>
              <span className="navigation-logo-text">
                <span>Email Classifier</span>
                <span className="navigation-navigation-logo-ai">AI</span>
              </span>
            </div>
          </a>

          {/* anchors corrigidos para bater com a Homepage */}
          <ul id="navigation-menu" ref={menuRef} className="navigation-menu">
            <li className="navigation-menu-item">
              <a href="#how-it-works-section" className="navigation-link"><span>Início</span></a>
            </li>
            <li className="navigation-menu-item">
              <a href="#demo-section" className="navigation-link"><span>Demo</span></a>
            </li>
            <li className="navigation-menu-item">
              <a href="#about-section" className="navigation-link"><span>Sobre</span></a>
            </li>
          </ul>

          <div className="navigation-actions" ref={actionsRef}>
            <a href="#demo-section" className="navigation-cta btn btn-primary">
              <span>Teste agora</span>
            </a>
          </div>

          <button
            id="navigation-toggle"
            ref={toggleRef}
            aria-label="Alternar menu"
            aria-controls="navigation-menu"
            aria-expanded="false"
            className="navigation-toggle"
            onClick={toggleMenu}
            type="button"
          >
            {/* ícone hamburguer */}
            <span className="navigation-navigation-toggle-icon1 navigation-toggle-icon-open" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M4 5h16M4 12h16M4 19h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {/* ícone fechar */}
            <span className="navigation-navigation-toggle-icon2" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <div
          id="navigation-mobile-overlay"
          ref={overlayRef}
          className="navigation-mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      </nav>
    </div>
  );
};

Navigation.propTypes = {
  rootClassName: PropTypes.string,
};

export default Navigation;
