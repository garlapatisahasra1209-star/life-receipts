import {
  categoryIcons,
  categoryColors,
  formatTime,
} from "../data/lifeLensUtils";

function LifeConstellation({ items, onStory }) {
  if (!items || items.length === 0) {
    return null;
  }

  const center = items[0];

  const satellites = items.slice(1, 7);

  const positions = [
    { top: "8%", left: "50%" },
    { top: "28%", left: "82%" },
    { top: "65%", left: "82%" },
    { top: "84%", left: "50%" },
    { top: "65%", left: "18%" },
    { top: "28%", left: "18%" },
  ];

  return (
    <section className="section constellation-section" id="constellation">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            05 · LIFE CONSTELLATION
          </span>

          <h2>Your moments form a pattern.</h2>

          <p>
            LifeLens connects separate digital receipts to reveal
            the real-life moment behind them.
          </p>
        </div>
      </div>

      <div className="constellation">

        <div className="constellation-orbit orbit-one" />
        <div className="constellation-orbit orbit-two" />

        {satellites.map((item, index) => (
          <div
            key={item.id}
            className="constellation-node satellite"
            style={positions[index]}
            onClick={() => onStory(item)}
            role="button"
            tabIndex="0"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onStory(item);
              }
            }}
          >
            <span
              className="node-icon"
              style={{
                background:
                  categoryColors[item.type] || "#999",
              }}
            >
              {categoryIcons[item.type] || "•"}
            </span>

            <div className="node-label">
              <strong>{item.title}</strong>
              <small>
                {item.type} · {formatTime(item.time)}
              </small>
            </div>
          </div>
        ))}

        <div
          className="constellation-node center-node"
          onClick={() => onStory(center)}
          role="button"
          tabIndex="0"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onStory(center);
            }
          }}
        >
          <div className="center-glow" />

          <span
            className="node-icon center-icon"
            style={{
              background:
                categoryColors[center.type] || "#ffd166",
            }}
          >
            {categoryIcons[center.type] || "✦"}
          </span>

          <strong>{center.title}</strong>

          <small>Central moment</small>
        </div>

        <div className="constellation-caption">
          <span>✦</span>
          <p>
            One moment can leave many digital traces.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LifeConstellation;