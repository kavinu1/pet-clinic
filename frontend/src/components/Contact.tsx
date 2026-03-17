import { useEffect, useId, useState } from "react";
import type { FormEventHandler } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const statusId = useId();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "Wellness Exam",
    message: "",
  });

  useEffect(() => {
    if (status !== "success") return;
    const id = window.setTimeout(() => setStatus("idle"), 10000);
    return () => window.clearTimeout(id);
  }, [status]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setStatus("success");
    setForm((prev) => ({ ...prev, message: "" }));
  };

  return (
    <section
      id="contact"
      className="contact section"
      aria-labelledby="contact-title"
    >
      <div className="container contact-container">
        <div className="contact-info">
          <h2 id="contact-title" className="section-title">
            Get in <span>Touch</span>
          </h2>
          <p className="section-subtitle">
            We would love to hear from you. Book an appointment or drop us a
            question.
          </p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <div>
                <h4>Location</h4>
                <p>Arukwatta Animal Clinic, Padukka Rd, Padukka</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <div>
                <h4>Email</h4>
                <p>hello@pawscare.com</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div>
                <h4>Hours</h4>
                <p>
                  Mon-Fri: 8am - 8pm
                  <br />
                  Sat-Sun: 9am - 5pm
                </p>
              </div>
            </div>
          </div>

          <div className="map-wrapper glass mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31691.03168408504!2d80.00621794999999!3d6.84509195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2518e99e2ee8d%3A0xc3eebfdbc86273ee!2sHomagama!5e0!3m2!1sen!2slk!4v1773742524841!5m2!1sen!2slk"
              width="100%"
              height="250"
              className="map-frame"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clinic Location"
            ></iframe>
          </div>
        </div>

        <div className="contact-form-wrapper glass">
          <form
            className="contact-form"
            onSubmit={onSubmit}
            aria-describedby={statusId}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Needed</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, service: e.target.value }))
                }
              >
                <option>Wellness Exam</option>
                <option>Vaccination</option>
                <option>Dental Care</option>
                <option>Surgical Services</option>
                <option>Other / Question</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, message: e.target.value }))
                }
                required
              />
            </div>
            <p
              id={statusId}
              className={`form-status ${status === "success" ? "success" : ""}`}
              role="status"
              aria-live="polite"
            >
              {status === "success"
                ? `Thanks${form.firstName ? `, ${form.firstName}` : ""}! We’ll reply to ${form.email || "your email"} soon.`
                : " "}
            </p>
            <button type="submit" className="btn btn-primary btn-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
