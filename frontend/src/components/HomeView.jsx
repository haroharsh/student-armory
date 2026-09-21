import React, { useState } from "react";
import BrandHeader from "./BrandHeader";
import {
  FileImage,
  ArrowRight,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  MessageSquareHeart,
  HelpCircle,
} from "lucide-react";

export default function HomeView({ onSelectService, backendStatus }) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 4000);
  };

  return (
    <div className="home-view">
      {/* Stylized Header Logo */}
      <header className="home-header">
        <BrandHeader onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <p className="hero-tagline">
          For the <span className="marker-highlight">students</span>, by the <span className="marker-highlight">students</span>
        </p>
      </header>

      {/* Sticky Note on the side */}
      <div className="sticky-note-wrapper">
        <div className="sticky-note">
          <span className="tape-strip"></span>
          <p className="sticky-handwriting">
            💡 100% Free toolkit for college & school assignments. No watermarks!
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="services-section">
        <div className="section-label-box">
          <h2 className="section-title-hand">Choose your weapon</h2>
        </div>

        {/* Primary Service Card (Image to PDF) */}
        <div className="services-grid">
          <div
            className="service-card service-card-active"
            onClick={() => onSelectService("image-to-pdf")}
            role="button"
            tabIndex={0}
          >
            <div className="card-badge-sticker">READY TO USE</div>
            <div className="service-icon-box">
              <FileImage size={32} className="service-icon" />
            </div>
            <div className="service-body">
              <h3 className="service-title">
                Image <span className="arrow-sym">→</span> PDF
              </h3>
              <p className="service-desc">
                Convert PNG, JPG, JPEG, GIF, SVG, TIFF & BMP images directly into crisp, downloadable PDFs.
              </p>
              <div className="service-features-list">
                <span>✓ High-Res Output</span>
                <span>✓ Portrait & Landscape</span>
                <span>✓ Up to 100 MB</span>
              </div>
            </div>
            <div className="service-action-row">
              <span className="btn-launch-tool">
                Launch Converter <ArrowRight size={18} />
              </span>
            </div>
          </div>

          {/* Secondary / Coming Soon Teasers */}
          <div className="service-card service-card-locked">
            <div className="card-badge-sticker sticker-amber">IN FORGE</div>
            <div className="service-icon-box icon-locked">
              <Layers size={32} />
            </div>
            <div className="service-body">
              <h3 className="service-title">PDF Merger & Splitter</h3>
              <p className="service-desc">
                Combine multiple assignment scans and lecture slides into a single organized PDF.
              </p>
              <div className="service-features-list">
                <span>⏳ Reorder pages</span>
                <span>⏳ Compress size</span>
              </div>
            </div>
            <div className="service-action-row">
              <span className="locked-label">
                <Lock size={14} /> Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* "and many more things coming soon" */}
        <div className="coming-soon-banner">
          <div className="dashed-line"></div>
          <div className="coming-soon-badge">
            <Sparkles size={16} className="sparkle-icon" />
            <span>and many more things coming soon</span>
            <Sparkles size={16} className="sparkle-icon" />
          </div>
          <div className="dashed-line"></div>
        </div>
      </section>

      {/* Contact Me Section */}
      <section className="contact-section">
        <div className="contact-card">
          <div className="contact-header">
            <div className="contact-badge">
              <MessageSquareHeart size={18} />
              <span>Got suggestions or questions?</span>
            </div>
            <h3 className="contact-title">Contact me</h3>
            <p className="contact-subtitle">
              Have an idea for a tool students need? Or found a bug? Let me know!
            </p>
          </div>

          {contactSubmitted ? (
            <div className="contact-success">
              <CheckCircle2 size={32} className="success-check" />
              <h4>Message received!</h4>
              <p>Thanks for reaching out! We'll review your feedback and build awesome tools for students.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="hand-label">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Harshit"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="notebook-input"
                  />
                </div>
                <div className="form-group">
                  <label className="hand-label">Your Email</label>
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="notebook-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="hand-label">Message / Tool Request *</label>
                <textarea
                  rows={3}
                  placeholder="Tell me what tool you'd like added next or share your thoughts..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="notebook-input"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-sketch-submit">
                <Send size={16} />
                <span>Send Note</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
