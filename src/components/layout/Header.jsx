import { useState } from 'react'
import { CloseIcon, GithubIcon, MailIcon, MenuIcon } from '../icons.jsx'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#home" className="brand" onClick={closeMenu}>
          <span className="brand-logo" aria-hidden="true">
            <MailIcon size={18} />
          </span>
          <span className="brand-name">TempMail</span>
        </a>

        <nav className={`header-nav${menuOpen ? ' is-open' : ''}`} id="primary-nav" aria-label="Primary">
          <a href="#home" className="nav-link" onClick={closeMenu}>
            Home
          </a>
          <a href="#how-it-works" className="nav-link" onClick={closeMenu}>
            How It Works
          </a>
          <a href="#privacy" className="nav-link" onClick={closeMenu}>
            Privacy
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="nav-github"
            aria-label="GitHub"
            onClick={closeMenu}
          >
            <GithubIcon size={18} />
          </a>
        </nav>

        <button
          type="button"
          className="header-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header
