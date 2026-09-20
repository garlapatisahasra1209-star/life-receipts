import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

/* =========================================================
   CONSTANTS
========================================================= */

const VALID_TYPES = new Set([
  "Music",
  "Movie",
  "Place",
  "Purchase",
  "Photo",
  "Message",
  "Search",
  "Event",
  "Personal Note",
]);

const MAX_TEXT_LENGTH = 240;
const CONNECTION_WINDOW_MINUTES = 90;

const categoryIcons = {
  Music: "♫",
  Movie: "▶",
  Place: "⌖",
  Purchase: "₹",
  Photo: "▣",
  Message: "✉",
  Search: "⌕",
  Event: "◆",
  "Personal Note": "✎",
};

const categoryColors = {
  Music: "music",
  Movie: "movie",
  Place: "place",
  Purchase: "purchase",
  Photo: "photo",
  Message: "message",
  Search: "search",
  Event: "event",
  "Personal Note": "note",
};

/* =========================================================
   SECURITY / DATA SANITIZATION
========================================================= */

function cleanText(value, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") return "";

  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanAmount(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return Math.round(number * 100) / 100;
}

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function sanitizeReceipt(item, index) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const type = cleanText(item.type, 30);

  if (!VALID_TYPES.has(type)) {
    return null;
  }

  const date = cleanText(item.date, 10);
  const time = cleanText(item.time, 5);

  if (!isValidDate(date) || !isValidTime(time)) {
    return null;
  }

  return {
    id: String(item.id ?? index + 1).slice(0, 50),
    type,
    title: cleanText(item.title, 100) || "Untitled moment",
    description:
      cleanText(item.description, MAX_TEXT_LENGTH) ||
      "A moment from your digital life.",
    date,
    time,
    location: cleanText(item.location, 100) || "Unknown location",
    amount: cleanAmount(item.amount),
  };
}

function sanitizeReceipts(data) {
  if (!Array.isArray(data)) {
    throw new Error("Receipt data must be an array.");
  }

  return data
    .map((item, index) => sanitizeReceipt(item, index))
    .filter(Boolean);
}

/* =========================================================
   HELPERS
========================================================= */

function getMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getTimeDifference(first, second) {
  return Math.abs(getMinutes(first) - getMinutes(second));
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

/* =========================================================
   RECEIPT CARD
========================================================= */

function ReceiptCard({ receipt, onOpen }) {
  const icon = categoryIcons[receipt.type] || "•";
  const colorClass = categoryColors[receipt.type] || "default";

  return (
    <button
      type="button"
      className={`receipt-card ${colorClass}`}
      onClick={() => onOpen(receipt)}
      aria-label={`Open ${receipt.title}, ${receipt.type}`}
    >
      <div className="receipt-top">
        <div className={`receipt-icon ${colorClass}`}>
          {icon}
        </div>

        <span className="receipt-type">
          {receipt.type}
        </span>
      </div>

      <h3>{receipt.title}</h3>

      <p>{receipt.description}</p>

      <div className="receipt-meta">
        <span>◷ {formatTime(receipt.time)}</span>
        <span>⌖ {receipt.location}</span>
      </div>

      {receipt.amount !== null && (
        <div className="receipt-amount">
          ₹{receipt.amount.toLocaleString("en-IN")}
        </div>
      )}
    </button>
  );
}

/* =========================================================
   CONNECTION CARD
========================================================= */

function ConnectionCard({ connection, onOpen }) {
  return (
    <button
      type="button"
      className="connection-card"
      onClick={() => onOpen(connection)}
      aria-label={`Open ${connection.title}`}
    >
      <div className="connection-header">
        <span className="connection-label">
          CONNECTION
        </span>

        <span className="connection-arrow">
          →
        </span>
      </div>

      <h3>{connection.title}</h3>

      <p className="connection-reason">
        {connection.reason}
      </p>

      <div className="connection-nodes">
        {connection.items.map((item) => (
          <div
            className="connection-node"
            key={`${connection.id}-${item.id}`}
          >
            <span>
              {categoryIcons[item.type] || "•"}
            </span>
            <small>{item.type}</small>
          </div>
        ))}
      </div>

      <div className="connection-location">
        ⌖ {connection.location}
      </div>
    </button>
  );
}

/* =========================================================
   STORY MODAL
========================================================= */

function StoryModal({ connection, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!connection) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;
    };
  }, [connection, onClose]);

  if (!connection) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="story-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
        tabIndex="-1"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close story"
        >
          ×
        </button>

        <span className="modal-eyebrow">
          YOUR DIGITAL STORY
        </span>

        <h2 id="story-title">
          {connection.title}
        </h2>

        <p className="modal-intro">
          Your digital receipts reveal a connected
          moment instead of isolated events.
        </p>

        <div className="story-summary">
          <div>
            <strong>{connection.items.length}</strong>
            <span>moments</span>
          </div>

          <div>
            <strong>
              {connection.types.length}
            </strong>
            <span>categories</span>
          </div>

          <div>
            <strong>
              {connection.duration}
            </strong>
            <span>minutes</span>
          </div>
        </div>

        <div className="story-timeline">
          {connection.items.map((item) => (
            <div
              className="story-item"
              key={item.id}
            >
              <div className="story-dot">
                {categoryIcons[item.type] || "•"}
              </div>

              <div>
                <span className="story-time">
                  {formatTime(item.time)}
                </span>

                <h4>{item.title}</h4>

                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="story-footer">
          <span>⌖ {connection.location}</span>
          <span>● {connection.reason}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedStory, setSelectedStory] =
    useState(null);

  const [selectedReceipt, setSelectedReceipt] =
    useState(null);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/data/receipts.json",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const safeReceipts = sanitizeReceipts(data);

      setReceipts(safeReceipts);
    } catch (err) {
      console.error(
        "Receipt loading failed:",
        err
      );

      setError(
        "We couldn't load your digital receipts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/data/receipts.json",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        const safeReceipts =
          sanitizeReceipts(data);

        if (!cancelled) {
          setReceipts(safeReceipts);
        }
      } catch (err) {
        console.error(
          "Receipt loading failed:",
          err
        );

        if (!cancelled) {
          setError(
            "We couldn't load your digital receipts. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(receipts.map((item) => item.type))
      ),
    ];
  }, [receipts]);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredReceipts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return receipts.filter((receipt) => {
      const matchesCategory =
        active === "All" ||
        receipt.type === active;

      if (!matchesCategory) return false;

      if (!query) return true;

      const searchableText = [
        receipt.title,
        receipt.description,
        receipt.location,
        receipt.type,
        receipt.date,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [receipts, active, search]);

  /* =======================================================
     DAY GROUPS / CHAPTERS
  ======================================================= */

  const dayGroups = useMemo(() => {
    const grouped = {};

    filteredReceipts.forEach((receipt) => {
      if (!grouped[receipt.date]) {
        grouped[receipt.date] = [];
      }

      grouped[receipt.date].push(receipt);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) =>
        b.localeCompare(a)
      )
      .map(([date, items]) => ({
        date,
        items: [...items].sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
      }));
  }, [filteredReceipts]);

  /* =======================================================
     SMART CONNECTION ENGINE
     
     Rules:
     1. Same date
     2. Same location
     3. Moments within 90 minutes
     4. At least two different categories
  ======================================================= */

  const connections = useMemo(() => {
    const groupsByDate = {};

    receipts.forEach((receipt) => {
      if (!groupsByDate[receipt.date]) {
        groupsByDate[receipt.date] = [];
      }

      groupsByDate[receipt.date].push(receipt);
    });

    const results = [];

    Object.entries(groupsByDate).forEach(
      ([date, items]) => {
        const sorted = [...items].sort(
          (a, b) =>
            getMinutes(a.time) -
            getMinutes(b.time)
        );

        const used = new Set();

        for (let i = 0; i < sorted.length; i++) {
          if (used.has(sorted[i].id)) continue;

          const cluster = [sorted[i]];

          for (
            let j = i + 1;
            j < sorted.length;
            j++
          ) {
            if (used.has(sorted[j].id)) continue;

            const current =
              sorted[j];

            const previous =
              cluster[cluster.length - 1];

            const sameLocation =
              current.location ===
              previous.location;

            const timeDifference =
              getTimeDifference(
                previous.time,
                current.time
              );

            if (
              sameLocation &&
              timeDifference <=
                CONNECTION_WINDOW_MINUTES
            ) {
              cluster.push(current);
            }
          }

          const uniqueTypes = [
            ...new Set(
              cluster.map(
                (item) => item.type
              )
            ),
          ];

          if (uniqueTypes.length >= 2) {
            cluster.forEach((item) =>
              used.add(item.id)
            );

            const first =
              cluster[0];

            const last =
              cluster[cluster.length - 1];

            const duration =
              getTimeDifference(
                first.time,
                last.time
              );

            results.push({
              id: `${date}-${first.id}`,
              date,
              location:
                first.location,
              items: cluster,
              types: uniqueTypes,
              duration,
              title:
                uniqueTypes.length >= 3
                  ? "A connected moment"
                  : "A hidden connection",
              reason:
                `Same place within ${duration} minutes`,
            });
          }
        }
      }
    );

    return results.sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [receipts]);

  /* =======================================================
     DYNAMIC INSIGHTS
  ======================================================= */

  const insights = useMemo(() => {
    const locationCounts = {};
    const categoryCounts = {};
    const dayCounts = {};

    receipts.forEach((receipt) => {
      locationCounts[receipt.location] =
        (locationCounts[receipt.location] || 0) +
        1;

      categoryCounts[receipt.type] =
        (categoryCounts[receipt.type] || 0) +
        1;

      dayCounts[receipt.date] =
        (dayCounts[receipt.date] || 0) +
        1;
    });

    const topLocation =
      Object.entries(locationCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const topCategory =
      Object.entries(categoryCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const mostActiveDay =
      Object.entries(dayCounts).sort(
        (a, b) => b[1] - a[1]
      )[0];

    const eveningMoments =
      receipts.filter(
        (receipt) =>
          getMinutes(receipt.time) >=
          18 * 60
      ).length;

    return {
      topLocation: topLocation
        ? topLocation[0]
        : "—",

      topLocationCount: topLocation
        ? topLocation[1]
        : 0,

      topCategory: topCategory
        ? topCategory[0]
        : "—",

      topCategoryCount: topCategory
        ? topCategory[1]
        : 0,

      mostActiveDay: mostActiveDay
        ? mostActiveDay[0]
        : "—",

      mostActiveDayCount:
        mostActiveDay
          ? mostActiveDay[1]
          : 0,

      eveningMoments,
    };
  }, [receipts]);

  /* =======================================================
     GLOBAL STATS
  ======================================================= */

  const stats = useMemo(() => {
    const uniqueLocations = new Set(
      receipts.map(
        (receipt) => receipt.location
      )
    ).size;

    const uniqueDates = new Set(
      receipts.map(
        (receipt) => receipt.date
      )
    ).size;

    return {
      moments: receipts.length,
      categories: new Set(
        receipts.map(
          (receipt) => receipt.type
        )
      ).size,
      connections: connections.length,
      chapters: uniqueDates,
      locations: uniqueLocations,
    };
  }, [receipts, connections]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <main
        className="loading-screen"
        role="status"
        aria-live="polite"
      >
        <div className="loading-logo">
          LifeLens
        </div>

        <p>
          Connecting your moments...
        </p>
      </main>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <main className="error-screen">
        <div className="error-card">
          <span className="error-icon">
            !
          </span>

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={loadReceipts}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="app">
      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        className="navbar"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="brand"
          aria-label="LifeLens home"
        >
          LifeLens
        </a>

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

      {/* ===================================================
          HERO
      =================================================== */}

      <header
        className="hero"
        id="top"
      >
        <div className="hero-content">
          <span className="eyebrow">
            YOUR DIGITAL LIFE, CONNECTED
          </span>

          <h1>
            Every moment
            <br />
            tells a story.
          </h1>

          <p>
            LifeLens transforms scattered digital
            receipts into meaningful moments,
            hidden connections and personal
            chapters.
          </p>

          <a
            href="#journey"
            className="hero-button"
          >
            Explore your journey
            <span>↓</span>
          </a>
        </div>

        <div
          className="hero-decoration"
          aria-hidden="true"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit-dot" />
        </div>
      </header>

      {/* ===================================================
          STATS
      =================================================== */}

      <section
        className="stats-section"
        aria-label="Life statistics"
      >
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
          <span>Chapters</span>
        </div>

        <div className="stat">
          <strong>{stats.locations}</strong>
          <span>Locations</span>
        </div>
      </section>

      {/* ===================================================
          JOURNEY
      =================================================== */}

      <section
        className="section journey-section"
        id="journey"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              01 — JOURNEY
            </span>

            <h2>
              Your moments,
              <br />
              one place.
            </h2>
          </div>

          <p>
            Search, filter and explore the digital
            traces that make up your journey.
          </p>
        </div>

        <div className="journey-controls">
          <label
            className="search-box"
            htmlFor="receipt-search"
          >
            <span aria-hidden="true">
              ⌕
            </span>

            <input
              id="receipt-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your moments..."
              aria-label="Search digital moments"
              autoComplete="off"
            />
          </label>

          <div
            className="filter-list"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  active === category
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setActive(category)
                }
                aria-pressed={
                  active === category
                }
              >
                {category !== "All" && (
                  <span>
                    {categoryIcons[
                      category
                    ] || "•"}
                  </span>
                )}

                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredReceipts.length === 0 ? (
          <div className="empty-state">
            <span>⌕</span>
            <h3>No moments found</h3>
            <p>
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="journey-grid">
            {filteredReceipts.map(
              (receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onOpen={setSelectedReceipt}
                />
              )
            )}
          </div>
        )}

        {selectedReceipt && (
          <div className="receipt-preview">
            <div>
              <span className="eyebrow">
                SELECTED MOMENT
              </span>

              <h3>
                {selectedReceipt.title}
              </h3>

              <p>
                {selectedReceipt.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedReceipt(null)
              }
              aria-label="Close selected moment"
            >
              ×
            </button>
          </div>
        )}
      </section>

      {/* ===================================================
          INSIGHTS
      =================================================== */}

      <section
        className="section insights-section"
        id="insights"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              02 — INSIGHTS
            </span>

            <h2>
              What your moments
              <br />
              reveal.
            </h2>
          </div>

          <p>
            Raw receipts become patterns when
            viewed together.
          </p>
        </div>

        <div className="insights-grid">
          <article className="insight-card large">
            <span className="insight-number">
              01
            </span>

            <span className="insight-icon">
              ⌖
            </span>

            <span className="insight-label">
              MOST VISITED
            </span>

            <h3>
              {insights.topLocation}
            </h3>

            <p>
              {insights.topLocationCount} moments
              were recorded here.
            </p>
          </article>

          <article className="insight-card">
            <span className="insight-number">
              02
            </span>

            <span className="insight-icon">
              ♫
            </span>

            <span className="insight-label">
              MOST ACTIVE CATEGORY
            </span>

            <h3>
              {insights.topCategory}
            </h3>

            <p>
              Appears {insights.topCategoryCount}{" "}
              times in your receipts.
            </p>
          </article>

          <article className="insight-card">
            <span className="insight-number">
              03
            </span>

            <span className="insight-icon">
              ◷
            </span>

            <span className="insight-label">
              EVENING ACTIVITY
            </span>

            <h3>
              {insights.eveningMoments} moments
            </h3>

            <p>
              Your digital trail becomes more
              active after 6 PM.
            </p>
          </article>

          <article className="insight-card">
            <span className="insight-number">
              04
            </span>

            <span className="insight-icon">
              ◆
            </span>

            <span className="insight-label">
              CONNECTIONS FOUND
            </span>

            <h3>
              {stats.connections}
            </h3>

            <p>
              Related moments were discovered
              automatically.
            </p>
          </article>
        </div>
      </section>

      {/* ===================================================
          CONNECTIONS
      =================================================== */}

      <section
        className="section connections-section"
        id="connections"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              03 — CONNECT THE DOTS
            </span>

            <h2>
              Moments become
              <br />
              meaningful together.
            </h2>
          </div>

          <p>
            LifeLens looks for moments that happen
            in the same place and close together in
            time.
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="empty-state">
            <span>◌</span>
            <h3>
              No strong connections yet
            </h3>
            <p>
              Add more moments from the same
              place and time to reveal a story.
            </p>
          </div>
        ) : (
          <div className="connections-grid">
            {connections.map(
              (connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onOpen={setSelectedStory}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ===================================================
          CHAPTERS
      =================================================== */}

      <section
        className="section chapters-section"
        id="chapters"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              04 — LIFE CHAPTERS
            </span>

            <h2>
              Your life,
              <br />
              in chapters.
            </h2>
          </div>

          <p>
            Each day becomes a chapter built from
            the moments you left behind.
          </p>
        </div>

        <div className="chapters-list">
          {dayGroups.map(
            (chapter, index) => (
              <article
                className="chapter-card"
                key={chapter.date}
              >
                <div className="chapter-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="chapter-main">
                  <span className="chapter-date">
                    {formatDate(
                      chapter.date
                    )}
                  </span>

                  <h3>
                    {chapter.items.length}{" "}
                    moments from this day
                  </h3>

                  <div className="chapter-tags">
                    {[
                      ...new Set(
                        chapter.items.map(
                          (item) =>
                            item.type
                        )
                      ),
                    ].map((type) => (
                      <span key={type}>
                        {categoryIcons[
                          type
                        ] || "•"}{" "}
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="chapter-open"
                  onClick={() => {
                    const connection =
                      connections.find(
                        (item) =>
                          item.date ===
                          chapter.date
                      );

                    if (connection) {
                      setSelectedStory(
                        connection
                      );
                    } else {
                      setSelectedReceipt(
                        chapter.items[0]
                      );
                    }
                  }}
                >
                  Open chapter
                  <span>→</span>
                </button>
              </article>
            )
          )}
        </div>
      </section>

      {/* ===================================================
          STORY CTA
      =================================================== */}

      <section className="story-banner">
        <div>
          <span className="eyebrow">
            LIFE IS MORE THAN DATA
          </span>

          <h2>
            Your digital life
            <br />
            has a story.
          </h2>
        </div>

        <a
          href="#journey"
          className="story-button"
        >
          Back to journey ↑
        </a>
      </section>

      {/* ===================================================
          STORY MODAL
      =================================================== */}

      <StoryModal
        connection={selectedStory}
        onClose={() =>
          setSelectedStory(null)
        }
      />

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="footer">
        <div className="footer-brand">
          LifeLens
        </div>

        <p>
          Your moments, connected.
        </p>

        <span>
          Frontend experience • React + Vite
        </span>
      </footer>
    </div>
  );
}

export default App;