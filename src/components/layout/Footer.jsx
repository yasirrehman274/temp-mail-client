import { MailIcon } from '../icons.jsx'

function Footer() {
  return (
    <footer className="footer" id="privacy">
      <div className="footer-inner">
        <span className="footer-brand">
          <span className="brand-logo brand-logo-sm" aria-hidden="true">
            <MailIcon size={16} />
          </span>
          TempMail
        </span>
        <p className="footer-note">
          A temporary inbox for protecting your real email address. Emails are stored for a short
          time and deleted automatically when the mailbox expires. We do not require an account and
          never sell your data.
        </p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <span className="footer-dot" aria-hidden="true">
            ·
          </span>
          <a href="#how-it-works">How It Works</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
