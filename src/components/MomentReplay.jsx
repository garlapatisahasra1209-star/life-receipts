import { useEffect, useMemo, useState } from "react";

import {
  categoryIcons,
  categoryColors,
  formatDate,
  formatTime,
} from "../data/lifeLensUtils";

function MomentReplay({ items, onStory }) {
  const moments = useMemo(() => {
    const groups = {};

    items.forEach((item) => {
      const key = `${item.date}-${item.location || "Unknown"}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
    });

    return Object.values(groups)
      .filter((group) => group.length >= 2)
      .map((group) =>
        [...group].sort((a, b) =>
          (a.time || "").localeCompare(b.time || "")
        )
      );
  }, [items]);

  const [momentIndex, setMomentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const moment = moments[momentIndex] || [];

  useEffect(() => {
    setActiveIndex(0);
    setPlaying(false);
  }, [momentIndex]);

  useEffect(() => {
    if (!playing || moment.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= moment.length - 1) {
          setPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [playing, moment.length]);

  if (!moment.length) {
    return null;
  }

  const start = moment[0];
  const end = moment[moment.length - 1];

  return (
    <section
      className="section moment-section"
      id="moments"
    >
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            05 · HIDDEN MOMENTS
          </span>

          <h2>
            We found a story inside your data.
          </h2>

          <p>
            LifeLens groups separate digital traces
            into meaningful real-life moments.
          </p>
        </div>
      </div>

      <div className="moment-discovery">

        <div className="moment-header">
          <div>
            <span className="moment-found">
              ✦ {moments.length} hidden moments discovered
            </span>

            <h3>
              {start.location || "Unknown place"} ·{" "}
              {formatDate(start.date)}
            </h3>

            <p>
              {moment.length} digital traces connected from{" "}
              {formatTime(start.time)} to{" "}
              {formatTime(end.time)}.
            </p>
          </div>

          <button
            className="replay-button"
            onClick={() => {
              setActiveIndex(0);
              setPlaying((value) => !value);
            }}
          >
            {playing ? "⏸ Pause" : "▶ Replay Moment"}
          </button>
        </div>

        <div className="moment-evidence">
          <div>
            <span>✓</span>
            <strong>Same date</strong>
          </div>

          <div>
            <span>✓</span>
            <strong>Same location</strong>
          </div>

          <div>
            <span>✓</span>
            <strong>Multiple categories</strong>
          </div>

          <div>
            <span>✓</span>
            <strong>Chronological sequence</strong>
          </div>
        </div>

        <div className="moment-timeline">
          {moment.map((item, index) => {
            const active = index === activeIndex;

            return (
              <button
                className={`moment-step ${
                  active ? "active" : ""
                }`}
                key={item.id}
                onClick={() => {
                  setActiveIndex(index);
                  setPlaying(false);
                }}
              >
                <span className="moment-time">
                  {formatTime(item.time)}
                </span>

                <div className="moment-item">
                  <span
                    className="moment-item-icon"
                    style={{
                      background:
                        categoryColors[item.type] ||
                        "#ffd166",
                    }}
                  >
                    {categoryIcons[item.type] || "•"}
                  </span>

                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.type}</small>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="moment-result">
          <div className="result-icon">
            ✦
          </div>

          <div>
            <span>STORY DISCOVERED</span>

            <h4>
              {moment[activeIndex]?.title}
            </h4>

            <p>
              {moment[activeIndex]?.description}
            </p>

            <button
              className="text-button"
              onClick={() =>
                onStory(moment[activeIndex])
              }
            >
              Explore this receipt →
            </button>
          </div>
        </div>

        {moments.length > 1 && (
          <div className="moment-switcher">
            {moments.map((_, index) => (
              <button
                key={index}
                className={
                  index === momentIndex
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setMomentIndex(index);
                  setPlaying(false);
                }}
              >
                Moment {index + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default MomentReplay;