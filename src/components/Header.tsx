import './styles/Header.css'

const Header = () => {
  return (
    <header className="top-nav">
      <div className="logo">
        <i className="bi bi-cloud-lightning-rain"></i>
        <span>Climezy</span>
      </div>
      <div className="nav-search">
        <form action="">
          <input type="text" placeholder="Search city..." />
        <i className="bi bi-search" style={{ cursor: "pointer", color: "var(--color-text-dim)" }}></i>
        </form>
      </div>
      <div className="sign-in-up-btn">
        <button className="btn btn-secondary">
          <span>Sign Up</span>
        </button>
        <button className="btn btn-primary">
          <span>Sign In</span>
        </button>
      </div>
    </header>
  )
}

export default Header