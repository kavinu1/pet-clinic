import { CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="container about-container">
        <div className="about-image-wrapper">
          <div className="square-pattern"></div>
          <img
            src="https://cdn.sanity.io/images/0vv8moc6/dvm360/cd7a7ab52bb9861c58b2075cffc6376c195f346c-5672x3394.jpg"
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
            For over a decade, Paws & Care has been the trusted name in
            veterinary medicine in our community.
          </p>
          <p>
            Our facility is equipped with cutting-edge technology to provide
            immediate and accurate diagnostics. But more importantly, our team
            treats your pets as if they were our own.
          </p>
          <ul className="about-features">
            <li>
              <span className="check">
                <CheckCircle2 size={16} />
              </span>{" "}
              Modern diagnostic equipment
            </li>
            <li>
              <span className="check">
                <CheckCircle2 size={16} />
              </span>{" "}
              Compassionate, experienced staff
            </li>
            <li>
              <span className="check">
                <CheckCircle2 size={16} />
              </span>{" "}
              Comfortable recovery wards
            </li>
            <li>
              <span className="check">
                <CheckCircle2 size={16} />
              </span>{" "}
              Easy online booking system
            </li>
          </ul>
          <a href="#contact" className="btn btn-primary mt-4">
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
