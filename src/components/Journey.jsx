import {
  categoryIcons,
  categoryColors,
  formatDate,
  formatTime,
} from "../data/lifeLensUtils";

function Journey({
  items,
  categories,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  onStory,
}) {
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.type === selectedCategory;

    const text = `${item.title} ${item.description} ${
      item.location || ""
    }`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section journey-section" id="journey">
      <div className="section-heading">
        <div>
          <span className="section-kicker">01 · RAW DATA</span>
          <h2>Your Journey</h2>
          <p>
            Browse the moments that make up your digital life.
          </p>
        </div>
      </div>

      <div className="journey-controls">
        <input
          type="search"
          placeholder="Search your receipts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search receipts"
        />

        <div className="category-filters">
          <button
            className={selectedCategory === "All" ? "active" : ""}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category ? "active" : ""
              }
              onClick={() => setSelectedCategory(category)}
            >
              {categoryIcons[category] || "•"} {category}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <span>🔎</span>
          <h3>No receipts found</h3>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <div className="receipt-grid">
          {filteredItems.map((item) => (
            <article className="receipt-card" key={item.id}>
              <div
                className="receipt-icon"
                style={{
                  background:
                    categoryColors[item.type] || "#999",
                }}
              >
                {categoryIcons[item.type] || "•"}
              </div>

              <div className="receipt-content">
                <div className="receipt-meta">
                  <span>{item.type}</span>
                  <span>{formatDate(item.date)}</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <div className="receipt-footer">
                  <span>🕐 {formatTime(item.time)}</span>

                  {item.location && (
                    <span>📍 {item.location}</span>
                  )}
                </div>

                {item.amount !== undefined && (
                  <strong className="receipt-amount">
                    ₹
                    {Number(item.amount).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                )}

                <button
                  className="text-button"
                  onClick={() => onStory(item)}
                >
                  View moment →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Journey;