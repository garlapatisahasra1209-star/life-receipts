function Insights({ items }) {
  const typeCounts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const topCategory =
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Unknown";

  const locations = new Set(
    items.map((item) => item.location).filter(Boolean)
  );

  const spending = items
    .filter((item) => typeof item.amount === "number")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="section insights-section" id="insights">
      <div className="section-heading">
        <div>
          <span className="section-kicker">02 · INSIGHTS</span>

          <h2>What Your Receipts Reveal</h2>

          <p>
            Patterns become visible when your moments are viewed
            together.
          </p>
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <span>🎯</span>

          <small>Your most frequent activity</small>

          <strong>{topCategory}</strong>

          <p>
            {typeCounts[topCategory] || 0} recorded moments
          </p>
        </div>

        <div className="insight-card">
          <span>📍</span>

          <small>Places represented</small>

          <strong>{locations.size}</strong>

          <p>Different locations in your receipts</p>
        </div>

        <div className="insight-card">
          <span>💰</span>

          <small>Recorded purchases</small>

          <strong>
            ₹{spending.toLocaleString("en-IN")}
          </strong>

          <p>Total visible purchase value</p>
        </div>
      </div>
    </section>
  );
}

export default Insights;