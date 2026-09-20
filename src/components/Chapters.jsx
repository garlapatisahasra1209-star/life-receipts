function Chapters({ dayGroups, onStory }) {
  return (
    <section className="section chapters-section" id="chapters">
      <div className="section-heading">
        <div>
          <span className="section-kicker">04 · STORY</span>

          <h2>Life Chapters</h2>

          <p>
            Your receipts become chapters when grouped into moments.
          </p>
        </div>
      </div>

      <div className="chapter-grid">
        {dayGroups.map((group) => (
          <article className="chapter-card" key={group.rawDate}>
            <div className="chapter-number">
              {String(group.items.length).padStart(2, "0")}
            </div>

            <div>
              <span className="chapter-date">{group.date}</span>

              <h3>
                {group.items.length >= 3
                  ? "A day full of moments"
                  : "A small moment in time"}
              </h3>

              <p>
                {group.items
                  .slice(0, 3)
                  .map((item) => item.title)
                  .join(" · ")}
              </p>

              <button
                className="text-button"
                onClick={() => onStory(group.items[0])}
              >
                Read this chapter →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Chapters;