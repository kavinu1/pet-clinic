import { CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="container about-container">
        <div className="about-image-wrapper">
          <div className="square-pattern"></div>
          <img 
            src="https://images.unsplash.com/photo-1596272875886-f6313ed6c99f?auto=format&fit=crop&w=800&q=80" 
            alt="Veterinarian examining a cat" 
            className="about-image glass"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-content">
          <h2 id="about-title" className="section-title">
            Passionate About <span>Pet Wellness</span>
          </h2>
          <p className="lead-text">
            For over a decade, Paws & Care has been the trusted name in veterinary medicine in our community.
          </p>
          <p>
            Our facility is equipped with cutting-edge technology to provide immediate and accurate diagnostics. But more importantly, our team treats your pets as if they were our own.
          </p>
          <ul className="about-features">
            <li><span className="check"><CheckCircle2 size={16} /></span> Modern diagnostic equipment</li>
            <li><span className="check"><CheckCircle2 size={16} /></span> Compassionate, experienced staff</li>
            <li><span className="check"><CheckCircle2 size={16} /></span> Comfortable recovery wards</li>
            <li><span className="check"><CheckCircle2 size={16} /></span> Easy online booking system</li>
          </ul>
          <a href="#contact" className="btn btn-primary mt-4">Book an Appointment</a>
        </div>
      </div>
    </section>
  );
};

export default About;
