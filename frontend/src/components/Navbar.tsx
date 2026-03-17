import { useEffect, useMemo, useRef, useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../auth/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const onHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = useMemo(
    () => [
      ...(onHome
        ? [
            { href: '#services', label: 'Services' },
            { href: '#about', label: 'About' },
            { href: '#contact', label: 'Contact' },
          ]
        : []),
    ],
    [onHome]
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const id = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const onLogout = () => {
    logout();
    closeMenu();
    navigate('/', { replace: true });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`} aria-label="Primary">
      <div className="container nav-container">
        {onHome ? (
          <a href="#top" className="logo">
            <span className="logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <PawPrint size={24} />
            </span>{' '}
            Paws & Care
          </a>
        ) : (
          <Link to="/" className="logo">
            <span className="logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <PawPrint size={24} />
            </span>{' '}
            Paws & Care
          </Link>
        )}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          {user ? (
            <li>
              <Link to="/dashboard">Pet Records</Link>
            </li>
          ) : null}
          {user?.role === 'staff' ? (
            <li>
              <Link to="/staff/pets/new">Add Patient</Link>
            </li>
          ) : null}
        </ul>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span className="nav-toggle-icon" aria-hidden="true" />
        </button>
        {user ? (
          <button type="button" className="btn btn-primary nav-cta" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary nav-cta">
            Login
          </Link>
        )}
      </div>

      <div
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <div
        id="mobile-menu"
        className={`mobile-menu glass ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button type="button" className="nav-close" onClick={closeMenu} aria-label="Close menu">
            ×
          </button>
        </div>
        <ul className="mobile-nav-links">
          {navLinks.map((link, index) => (
            <li key={link.href}>
              <a
                ref={index === 0 ? firstMobileLinkRef : undefined}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
          {user ? (
            <li>
              <Link
                ref={navLinks.length === 0 ? firstMobileLinkRef : undefined}
                to="/dashboard"
                onClick={closeMenu}
              >
                Pet Records
              </Link>
            </li>
          ) : null}
          {user?.role === 'staff' ? (
            <li>
              <Link to="/staff/pets/new" onClick={closeMenu}>
                Add Patient
              </Link>
            </li>
          ) : null}
        </ul>
        {user ? (
          <button type="button" className="btn btn-primary btn-full" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-full" onClick={closeMenu}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
