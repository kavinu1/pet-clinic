import { PawPrint, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer auto-mt">
      <div className="container footer-container">
        <div className="footer-brand">
          <a href="#" className="logo">
            <span className="logo-icon" style={{ display: 'flex', alignItems: 'center' }}><PawPrint size={24} /></span> Paws & Care
          </a>
          <p>Providing the best veterinary care with compassion, expertise, and love for every animal.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Paws & Care Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
