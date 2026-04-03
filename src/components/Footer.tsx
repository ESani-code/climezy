import './styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">

      {/* Background image layer */}
      <div className="footer__bg" aria-hidden="true" />

      {/* Glassmorphism overlay */}
      <div className="footer__glass" aria-hidden="true" />

      {/* Watermark wordmark */}
      <div className="footer__watermark" aria-hidden="true">Climezy</div>

      {/* Main content */}
      <div className="footer__inner">

        {/* ── Top grid: brand + link columns ─────────────────── */}
        <div className="footer__grid">

          {/* Brand column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <i className="bi bi-cloud-lightning-rain footer__logo-icon" />
              <span className="footer__logo-name">Climezy</span>
            </div>
            <p className="footer__tagline">
              Live Weather,<br />Every city. Right now.
            </p>
            <p className="footer__description">
              Lorem Ipsum Lorem Ipsum Lorem Ipsum
              Lorem Ipsum Lorem Ipsum Lorem Ipsum.
            </p>
            {/* Social icons */}
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" className="footer__social-link" aria-label="X / Twitter">
                <i className="bi bi-twitter-x" />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Company</h4>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">Weather Forecast</a></li>
              <li><a href="#" className="footer__link">About Us</a></li>
              <li><a href="#" className="footer__link">Careers</a></li>
              <li><a href="#" className="footer__link">Press</a></li>
            </ul>
          </div>

          {/* Weather Forecast links */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Weather Forecast</h4>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">Search</a></li>
            </ul>
          </div>

          {/* Contact links */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Contact</h4>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">Support</a></li>
              <li><a href="#" className="footer__link">Feedback</a></li>
              <li><a href="#" className="footer__link">Privacy Policy</a></li>
              <li><a href="#" className="footer__link">Terms of Use</a></li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="footer__bottom">
          <span className="footer__copyright">
            &copy; {new Date().getFullYear()}, All rights reserved.
          </span>
          <span className="footer__bottom-links">
            <a href="#" className="footer__link">Privacy</a>
            <span className="footer__bottom-dot" aria-hidden="true">·</span>
            <a href="#" className="footer__link">Terms</a>
            <span className="footer__bottom-dot" aria-hidden="true">·</span>
            <a href="#" className="footer__link">Cookies</a>
          </span>
        </div>

      </div>
    </footer>
  )
}

export default Footer