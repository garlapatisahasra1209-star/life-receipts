function Stats({ stats }) {
  return (
    <section className="stats-section">
      <div className="stat-card">
        <span>🧾</span>
        <strong>{stats.total}</strong>
        <small>Total Moments</small>
      </div>

      <div className="stat-card">
        <span>📍</span>
        <strong>{stats.locations}</strong>
        <small>Places</small>
      </div>

      <div className="stat-card">
        <span>📅</span>
        <strong>{stats.days}</strong>
        <small>Active Days</small>
      </div>

      <div className="stat-card">
        <span>🔗</span>
        <strong>{stats.connections}</strong>
        <small>Connections</small>
      </div>
    </section>
  );
}

export default Stats;