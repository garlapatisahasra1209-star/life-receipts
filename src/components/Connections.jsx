function Connections({ connections, onStory }) {
  return (
    <section
      className="section connections-section"
      id="connections"
    >
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            03 · CONNECTIONS
          </span>

          <h2>Connect the Dots</h2>

          <p>
            Separate receipts can belong to the same real-life
            moment.
          </p>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="empty-state">
          <span>🔗</span>

          <h3>No connections yet</h3>

          <p>
            More related receipts will create stronger
            connections.
          </p>
        </div>
      ) : (
        <div className="connection-grid">
          {connections.map((connection) => (
            <article
              className="connection-card"
              key={connection.id}
            >
              <div className="connection-line">
                <span>🔗</span>
                <span>{connection.reason}</span>
              </div>

              <div className="connection-items">
                {connection.items.map((item) => (
                  <div
                    className="connection-item"
                    key={item.id}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.type}</span>
                  </div>
                ))}
              </div>

              <button
                className="text-button"
                onClick={() => onStory(connection.items[0])}
              >
                Explore connection →
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Connections;