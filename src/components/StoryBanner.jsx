function StoryBanner({ onStory }) {
  return (
    <section className="story-banner">
      <div>
        <span className="section-kicker">
          YOUR DIGITAL STORY
        </span>

        <h2>
          Raw Data → Insights → Connections → Story
        </h2>

        <p>
          LifeLens transforms scattered digital receipts into
          a journey you can actually understand.
        </p>
      </div>

      <button onClick={onStory}>
        Explore your story →
      </button>
    </section>
  );
}

export default StoryBanner;