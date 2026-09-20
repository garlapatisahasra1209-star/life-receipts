function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-mark">✦</span>
        <span>LifeLens</span>
      </div>

      <div className="nav-links">
        <button onClick={() => onNavigate("journey")}>
          Journey
        </button>

        <button onClick={() => onNavigate("insights")}>
          Insights
        </button>

        <button onClick={() => onNavigate("connections")}>
          Connections
        </button>

        <button onClick={() => onNavigate("chapters")}>
          Chapters
        </button>
      </div>
    </nav>
  );
}

export default Navbar;