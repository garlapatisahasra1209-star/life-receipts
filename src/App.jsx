import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categoryIcons = {
  Music: "🎵",
  Movie: "🎬",
  "Movies & Entertainment": "🎬",
  Place: "📍",
  Places: "📍",
  Purchase: "🛍️",
  Purchases: "🛍️",
  Photo: "📸",
  Photos: "📸",
  Message: "💬",
  Messages: "💬",
  Search: "🔎",
  Searches: "🔎",
  Event: "🎟️",
  Events: "🎟️",
  "Personal Note": "📝",
  "Personal Notes": "📝",
};

const categoryColors = {
  Music: "music",
  Movie: "movie",
  "Movies & Entertainment": "movie",
  Place: "place",
  Places: "place",
  Purchase: "purchase",
  Purchases: "purchase",
  Photo: "photo",
  Photos: "photo",
  Message: "message",
  Messages: "message",
  Search: "search",
  Searches: "search",
  Event: "event",
  Events: "event",
  "Personal Note": "note",
  "Personal Notes": "note",
};

function App() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [showStory, setShowStory] = useState(null);

  // Load the JSON dataset
  useEffect(() => {
    fetch("/data/receipts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load receipts.json");
        }

        return response.json();
      })
      .then((data) => {
        setReceipts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Get categories
  const categories = useMemo(() => {
    const unique = [...new Set(receipts.map((item) => item.type))];

    return ["All", ...unique];
  }, [receipts]);

  // Search + filter
  const filteredReceipts = useMemo(() => {
    return receipts.filter((item) => {
      const matchesCategory =
        active === "All" || item.type === active;

      const text =
        `${item.title} ${item.description} ${item.location} ${item.type}`
          .toLowerCase();

      const matchesSearch =
        search.trim() === "" ||
        text.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [receipts, active, search]);

  // Group moments by date
  const dayGroups = useMemo(() => {
    const groups = {};

    receipts.forEach((item) => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }

      groups[item.date].push(item);
    });

    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        items,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [receipts]);

  // Find connections
  const connections = useMemo(() => {
    return dayGroups
      .filter((group) => {
        const types = new Set(
          group.items.map((item) => item.type)
        );

        return types.size >= 2;
      })
      .map((group) => {
        const types = [
          ...new Set(group.items.map((item) => item.type)),
        ];

        return {
          ...group,
          types,
          title:
            types.length >= 3
              ? "A connected moment"
              : "A hidden connection",
        };
      });
  }, [dayGroups]);

  // Statistics
  const stats = useMemo(() => {
    const uniqueLocations = new Set(
      receipts
        .map((item) => item.location)
        .filter(Boolean)
    );

    return {
      moments: receipts.length,
      categories: new Set(
        receipts.map((item) => item.type)
      ).size,
      connections: connections.length,
      chapters: dayGroups.length,
      locations: uniqueLocations.size,
    };
  }, [receipts, connections, dayGroups]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "";

    const [hourString, minute] = time.split(":");

    let hour = Number(hourString);

    if (Number.isNaN(hour)) {
      return time;
    }

    const suffix = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${suffix}`;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">✦</div>

        <h2>Loading your life...</h2>

        <p>
          Connecting your digital receipts.
        </p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-mark">
            ✦
          </div>

          <div>
            <div className="brand-name">
              LifeLens
            </div>

            <div className="brand-tagline">
              Your moments, connected.
            </div>
          </div>

        </div>

        <div className="nav-links">

          <a href="#journey">
            Journey
          </a>

          <a href="#insights">
            Insights
          </a>

          <a href="#connections">
            Connections
          </a>

          <a href="#chapters">
            Chapters
          </a>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            YOUR DIGITAL LIFE
          </div>

          <h1>
            Every moment
            <br />
            tells a <span>story.</span>
          </h1>

          <p>
            LifeLens transforms scattered digital receipts
            into meaningful moments, hidden connections
            and personal chapters.
          </p>

          <div className="hero-actions">

            <a
              href="#journey"
              className="primary-btn"
            >
              Explore my journey →
            </a>

            <a
              href="#connections"
              className="secondary-btn"
            >
              ✦ Find connections
            </a>

          </div>

        </div>


        {/* Hero visual */}

        <div className="hero-orbit">

          <div className="orbit orbit-one"></div>

          <div className="orbit orbit-two"></div>

          <div className="orbit-center">
            <span>✦</span>
          </div>

          <div className="floating-card card-one">
            🎵 Music
          </div>

          <div className="floating-card card-two">
            📍 Place
          </div>

          <div className="floating-card card-three">
            📸 Photo
          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats-section">

        <div className="stat">
          <strong>{stats.moments}</strong>
          <span>Moments</span>
        </div>

        <div className="stat">
          <strong>{stats.categories}</strong>
          <span>Categories</span>
        </div>

        <div className="stat">
          <strong>{stats.connections}</strong>
          <span>Connections</span>
        </div>

        <div className="stat">
          <strong>{stats.chapters}</strong>
          <span>Life Chapters</span>
        </div>

        <div className="stat">
          <strong>{stats.locations}</strong>
          <span>Places</span>
        </div>

      </section>


      {/* ================= JOURNEY ================= */}

      <section
        className="section"
        id="journey"
      >

        <div className="section-heading">

          <div>

            <div className="eyebrow">
              RAW DATA → STORY
            </div>

            <h2>
              Your digital journey
            </h2>

          </div>


          <div className="search-box">

            🔎

            <input
              type="text"
              placeholder="Search your moments..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* Filters */}

        <div className="filters">

          {categories.map((category) => (

            <button
              key={category}
              className={
                active === category
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setActive(category)
              }
            >

              {category !== "All" && (
                <span>
                  {categoryIcons[category] || "✦"}
                </span>
              )}

              {category}

            </button>

          ))}

        </div>


        {/* Receipt cards */}

        <div className="receipt-grid">

          {filteredReceipts.length === 0 ? (

            <div className="empty-state">

              <div>🔎</div>

              <h3>
                No moments found
              </h3>

              <p>
                Try another search or category.
              </p>

            </div>

          ) : (

            filteredReceipts.map((item) => (

              <article
                className="receipt-card"
                key={item.id}
                onClick={() =>
                  setShowStory(item)
                }
              >

                <div
                  className={`receipt-icon ${
                    categoryColors[item.type] || ""
                  }`}
                >
                  {categoryIcons[item.type] || "✦"}
                </div>


                <div className="receipt-content">

                  <div className="receipt-top">

                    <span className="receipt-type">
                      {item.type}
                    </span>

                    {item.amount !== undefined && (
                      <span className="amount">
                        ₹{item.amount}
                      </span>
                    )}

                  </div>


                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>


                  <div className="receipt-meta">

                    <span>
                      📅 {formatDate(item.date)}
                    </span>

                    {item.time && (
                      <span>
                        🕐 {formatTime(item.time)}
                      </span>
                    )}

                    {item.location && (
                      <span>
                        📍 {item.location}
                      </span>
                    )}

                  </div>

                </div>


                <div className="receipt-arrow">
                  →
                </div>

              </article>

            ))

          )}

        </div>

      </section>


      {/* ================= INSIGHTS ================= */}

      <section
        className="section insights-section"
        id="insights"
      >

        <div className="section-heading">

          <div>

            <div className="eyebrow">
              RAW DATA → INSIGHTS
            </div>

            <h2>
              What your moments reveal
            </h2>

            <p>
              Instead of simply showing your data,
              LifeLens looks for patterns hidden
              inside everyday moments.
            </p>

          </div>

        </div>


        <div className="insights-grid">

          {/* Insight 1 */}

          <div className="insight-card">

            <div className="insight-icon">
              📊
            </div>

            <span className="insight-label">
              DIGITAL ACTIVITY
            </span>

            <strong>
              {stats.moments} moments
            </strong>

            <p>
              Your digital life is made up of
              many small moments across
              different categories.
            </p>

          </div>


          {/* Insight 2 */}

          <div className="insight-card">

            <div className="insight-icon">
              🧩
            </div>

            <span className="insight-label">
              PATTERNS FOUND
            </span>

            <strong>
              {stats.connections} connections
            </strong>

            <p>
              Different types of activity
              happened together, revealing
              relationships between your moments.
            </p>

          </div>


          {/* Insight 3 */}

          <div className="insight-card">

            <div className="insight-icon">
              📍
            </div>

            <span className="insight-label">
              YOUR JOURNEY
            </span>

            <strong>
              {stats.locations} places
            </strong>

            <p>
              Your digital receipts can also
              reveal the places connected to
              your everyday experiences.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CONNECTIONS ================= */}

      <section
        className="section connections-section"
        id="connections"
      >

        <div className="section-heading">

          <div>

            <div className="eyebrow">
              RAW DATA → CONNECTIONS
            </div>

            <h2>
              Connect the dots
            </h2>

            <p>
              Life doesn't happen in separate
              categories. We found moments where
              different parts of your digital life
              came together.
            </p>

          </div>

        </div>


        <div className="connection-grid">

          {connections.length === 0 ? (

            <div className="empty-state">

              <div>✦</div>

              <h3>
                No connections yet
              </h3>

              <p>
                Add more moments on the same
                day to discover relationships.
              </p>

            </div>

          ) : (

            connections
              .slice(0, 6)
              .map((connection, index) => (

                <article
                  className="connection-card"
                  key={
                    connection.date + index
                  }
                  onClick={() =>
                    setShowStory(connection)
                  }
                >

                  <div className="connection-number">
                    0{index + 1}
                  </div>


                  <div className="connection-visual">

                    {connection.items
                      .slice(0, 4)
                      .map((item) => (

                        <div
                          className="connection-node"
                          key={item.id}
                        >
                          {categoryIcons[item.type] || "✦"}
                        </div>

                      ))}

                  </div>


                  <div className="connection-content">

                    <span className="connection-date">
                      {formatDate(connection.date)}
                    </span>

                    <h3>
                      {connection.title}
                    </h3>

                    <p>
                      {connection.items.length} digital
                      moments appeared together across{" "}
                      {connection.types.length} categories.
                    </p>


                    <div className="connection-tags">

                      {connection.types.map(
                        (type) => (

                          <span key={type}>
                            {categoryIcons[type] || "✦"}{" "}
                            {type}
                          </span>

                        )
                      )}

                    </div>

                  </div>


                  <div className="connection-arrow">
                    →
                  </div>

                </article>

              ))

          )}

        </div>

      </section>


      {/* ================= LIFE CHAPTERS ================= */}

      <section
        className="section"
        id="chapters"
      >

        <div className="section-heading">

          <div>

            <div className="eyebrow">
              CONNECTIONS → STORY
            </div>

            <h2>
              Life chapters
            </h2>

            <p>
              Your moments become chapters when
              viewed as part of a bigger story.
            </p>

          </div>

        </div>


        <div className="chapters-grid">

          {dayGroups
            .slice(0, 6)
            .map((chapter, index) => (

              <article
                className="chapter-card"
                key={chapter.date}
                onClick={() =>
                  setShowStory(chapter)
                }
              >

                <div className="chapter-number">
                  CHAPTER{" "}
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>


                <div className="chapter-icon">

                  {index % 3 === 0
                    ? "🌙"
                    : index % 3 === 1
                    ? "☀️"
                    : "✨"}

                </div>


                <h3>
                  {formatDate(chapter.date)}
                </h3>


                <p>
                  {chapter.items.length} moments
                  from different parts of your
                  digital life.
                </p>


                <div className="chapter-items">

                  {chapter.items
                    .slice(0, 4)
                    .map((item) => (

                      <span key={item.id}>
                        {categoryIcons[item.type] || "✦"}
                      </span>

                    ))}

                </div>


                <button>
                  Open chapter →
                </button>

              </article>

            ))}

        </div>

      </section>


      {/* ================= FINAL STORY ================= */}

      <section className="story-banner">

        <div>

          <div className="eyebrow">
            THE BIG PICTURE
          </div>

          <h2>
            Your data isn't just data.
            <br />
            <span>
              It's your story.
            </span>
          </h2>

          <p>
            From a song to a place, from a
            purchase to a photograph — LifeLens
            reveals the connections hiding between
            your everyday moments.
          </p>

        </div>


        <div className="story-symbol">
          ✦
        </div>

      </section>


      {/* ================= STORY MODAL ================= */}

      {showStory && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowStory(null)
          }
        >

          <div
            className="story-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowStory(null)
              }
            >
              ×
            </button>


            <div className="modal-symbol">
              ✦
            </div>


            <div className="eyebrow">
              LIFE MOMENT
            </div>


            <h2>
              {showStory.title ||
                "Your story"}
            </h2>


            {/* Connected story */}

            {showStory.items ? (

              <div className="modal-items">

                {showStory.items.map(
                  (item) => (

                    <div
                      className="modal-item"
                      key={item.id}
                    >

                      <div className="modal-item-icon">

                        {categoryIcons[
                          item.type
                        ] || "✦"}

                      </div>


                      <div>

                        <strong>
                          {item.title}
                        </strong>

                        <p>
                          {item.description}
                        </p>

                        <small>

                          {item.type}

                          {item.time
                            ? ` • ${formatTime(
                                item.time
                              )}`
                            : ""}

                        </small>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              /* Single story */

              <div className="single-story">

                <div className="large-story-icon">

                  {categoryIcons[
                    showStory.type
                  ] || "✦"}

                </div>


                <p>
                  {showStory.description}
                </p>


                <div className="story-details">

                  <span>
                    📅{" "}
                    {formatDate(
                      showStory.date
                    )}
                  </span>


                  {showStory.time && (
                    <span>
                      🕐{" "}
                      {formatTime(
                        showStory.time
                      )}
                    </span>
                  )}


                  {showStory.location && (
                    <span>
                      📍{" "}
                      {showStory.location}
                    </span>
                  )}

                </div>

              </div>

            )}


            <button
              className="primary-btn modal-btn"
              onClick={() =>
                setShowStory(null)
              }
            >
              Back to my journey
            </button>

          </div>

        </div>

      )}


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="footer-brand">
          ✦ LifeLens
        </div>

        <p>
          Raw Data → Insights → Connections → Story
        </p>

        <span>
          Built for the hackathon
        </span>

      </footer>

    </div>
  );
}

export default App;