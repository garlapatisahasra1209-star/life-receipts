function Hero({ totalReceipts, totalCategories }) {
  return (
    <section className="hero">
      <div className="hero-decoration hero-decoration-one" />
      <div className="hero-decoration hero-decoration-two" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          YOUR DIGITAL LIFE, CONNECTED
        </div>

        <h1>
          Your Life,
          <br />
          <span>In Receipts.</span>
        </h1>

        <p>
          Every song, place, purchase, photo and message tells
          part of your story. LifeLens turns those tiny digital
          moments into meaningful connections.
        </p>

        <div className="hero-stats">
          <div>
            <strong>{totalReceipts}</strong>
            <span>Receipts</span>
          </div>

          <div>
            <strong>{totalCategories}</strong>
            <span>Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;