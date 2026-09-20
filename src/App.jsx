import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Journey from "./components/Journey";
import Insights from "./components/Insights";
import Connections from "./components/Connections";
import Chapters from "./components/Chapters";
import MomentReplay from "./components/MomentReplay";
import StoryBanner from "./components/StoryBanner";
import StoryModal from "./components/StoryModal";
import Footer from "./components/Footer";

import {
  formatDate,
  findConnections,
} from "./data/lifeLensUtils";

function App() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [selectedStory, setSelectedStory] =
    useState(null);

  /* =====================================================
     LOAD RECEIPTS
     ===================================================== */

  useEffect(() => {
    fetch("/data/receipts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Could not load receipt data."
          );
        }

        return response.json();
      })
      .then((data) => {
        setReceipts(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);

        setError(
          "We couldn't load your life receipts."
        );

        setLoading(false);
      });
  }, []);

  /* =====================================================
     CATEGORIES
     ===================================================== */

  const categories = useMemo(() => {
    return [
      ...new Set(
        receipts.map((item) => item.type)
      ),
    ];
  }, [receipts]);

  /* =====================================================
     GROUP RECEIPTS INTO DAYS
     ===================================================== */

  const dayGroups = useMemo(() => {
    const groups = {};

    receipts.forEach((item) => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }

      groups[item.date].push(item);
    });

    return Object.entries(groups)
      .sort(
        ([a], [b]) =>
          new Date(a) - new Date(b)
      )
      .map(([date, items]) => ({
        date: formatDate(date),

        rawDate: date,

        items: [...items].sort((a, b) =>
          (a.time || "").localeCompare(
            b.time || ""
          )
        ),
      }));
  }, [receipts]);

  /* =====================================================
     CONNECTIONS
     ===================================================== */

  const connections = useMemo(() => {
    return findConnections(receipts);
  }, [receipts]);

  /* =====================================================
     DASHBOARD STATS
     ===================================================== */

  const stats = useMemo(() => {
    const locations = new Set(
      receipts
        .map((item) => item.location)
        .filter(Boolean)
    );

    const days = new Set(
      receipts.map((item) => item.date)
    );

    return {
      total: receipts.length,

      locations: locations.size,

      days: days.size,

      connections: connections.length,
    };
  }, [receipts, connections]);

  /* =====================================================
     NAVIGATION
     ===================================================== */

  function navigateTo(id) {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  /* =====================================================
     STORY MODAL
     ===================================================== */

  function openStory(item) {
    if (!item) return;

    setSelectedStory(item);
  }

  function closeStory() {
    setSelectedStory(null);
  }

  /* =====================================================
     LOADING SCREEN
     ===================================================== */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <span>✦</span>

          <h2>
            Loading your story...
          </h2>

          <p>
            Connecting your digital moments.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR SCREEN
     ===================================================== */

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <span>⚠️</span>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN APPLICATION
     ===================================================== */

  return (
    <div className="app">

      {/* Navigation */}

      <Navbar
        onNavigate={navigateTo}
      />

      <main>

        {/* =================================================
           HERO
           ================================================= */}

        <Hero
          totalReceipts={receipts.length}
          totalCategories={categories.length}
        />

        {/* =================================================
           STATS
           ================================================= */}

        <Stats
          stats={stats}
        />

        {/* =================================================
           RAW DATA
           ================================================= */}

        <Journey
          items={receipts}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={
            setSelectedCategory
          }
          search={search}
          setSearch={setSearch}
          onStory={openStory}
        />

        {/* =================================================
           INSIGHTS
           ================================================= */}

        <Insights
          items={receipts}
        />

        {/* =================================================
           CONNECTIONS
           ================================================= */}

        <Connections
          connections={connections}
          onStory={openStory}
        />

        {/* =================================================
           LIFE CHAPTERS
           ================================================= */}

        <Chapters
          dayGroups={dayGroups}
          onStory={openStory}
        />

        {/* =================================================
           UNIQUE FEATURE
           HIDDEN MOMENTS / MOMENT REPLAY
           ================================================= */}

        <MomentReplay
          items={receipts}
          onStory={openStory}
        />

        {/* =================================================
           FINAL STORY BANNER
           ================================================= */}

        <StoryBanner
          onStory={() => {
            if (receipts.length > 0) {
              openStory(receipts[0]);
            }
          }}
        />

      </main>

      {/* ===================================================
         FOOTER
         =================================================== */}

      <Footer />

      {/* ===================================================
         STORY MODAL
         =================================================== */}

      <StoryModal
        item={selectedStory}
        onClose={closeStory}
      />

    </div>
  );
}

export default App;