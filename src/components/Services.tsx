import { Stethoscope, Syringe, HeartPulse, Scissors, Microscope, Hospital } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <HeartPulse size={48} strokeWidth={1.5} />,
      title: 'Wellness Exams',
      desc: 'Comprehensive annual check-ups to keep your pet healthy year-round.'
    },
    {
      icon: <Syringe size={48} strokeWidth={1.5} />,
      title: 'Vaccinations',
      desc: 'Core and lifestyle vaccines tailored to your pet\'s specific needs.'
    },
    {
      icon: <Stethoscope size={48} strokeWidth={1.5} />,
      title: 'Dental Care',
      desc: 'Professional cleaning and oral surgery to ensure a healthy smile.'
    },
    {
      icon: <Scissors size={48} strokeWidth={1.5} />,
      title: 'Surgical Services',
      desc: 'Safe, state-of-the-art surgical procedures with dedicated monitoring.'
    },
    {
      icon: <Microscope size={48} strokeWidth={1.5} />,
      title: 'Diagnostics',
      desc: 'In-house laboratory, digital X-rays, and ultrasound imaging.'
    },
    {
      icon: <Hospital size={48} strokeWidth={1.5} />,
      title: 'Emergency Care',
      desc: '24/7 urgent care for when your pet needs medical attention immediately.'
    }
  ];

  return (
    <section id="services" className="services section bg-light" aria-labelledby="services-title">
      <div className="container text-center">
        <h2 id="services-title" className="section-title">Our <span>Services</span></h2>
        <p className="section-subtitle">
          From routine check-ups to advanced treatments, we provide full-spectrum care.
        </p>

        <div className="services-grid">
          {services.map((svc, idx) => (
            <div className="service-card glass" key={idx}>
              <div className="service-icon">{svc.icon}</div>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
              <a
                href="#contact"
                className="service-link"
                aria-label={`Learn more about ${svc.title}`}
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
