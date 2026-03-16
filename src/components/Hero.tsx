const Hero = () => {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 id="hero-title" className="hero-title">
            Premium Care for Your <br/><span className="gradient-text hero-accent">Best Friend</span>
          </h1>
          <p className="hero-subtitle">
            State-of-the-art veterinary clinic offering compassionate, 
            comprehensive care to keep your pets healthy and happy.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary btn-lg">Schedule Visit</a>
            <a href="#services" className="btn btn-outline btn-lg">Our Services</a>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <h3>5k+</h3>
              <p>Happy Pets</p>
            </div>
            <div className="stat">
              <h3>15+</h3>
              <p>Expert Vets</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Emergency</p>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-shape"></div>
          <div className="hero-image glass">
            <img 
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80" 
              alt="Happy dog looking at a veterinarian" 
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
