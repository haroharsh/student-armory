import React from "react";
import { Zap, ShieldCheck, FileType2, HardDriveDownload } from "lucide-react";

export default function FeaturesBanner() {
  const features = [
    {
      icon: <Zap className="feat-icon" />,
      title: "Ultra-Fast Conversion",
      desc: "Cloud-accelerated conversion powered by ApyHub API.",
    },
    {
      icon: <FileType2 className="feat-icon" />,
      title: "Universal Formats",
      desc: "Convert PNG, JPG, JPEG, GIF, SVG, TIFF, & BMP seamlessly.",
    },
    {
      icon: <HardDriveDownload className="feat-icon" />,
      title: "Up to 100 MB Files",
      desc: "Process high-resolution screenshots, documents, and charts.",
    },
    {
      icon: <ShieldCheck className="feat-icon" />,
      title: "Secure Spring Boot Proxy",
      desc: "API keys stay safe on the backend without exposure to the client.",
    },
  ];

  return (
    <div className="features-grid">
      {features.map((f, i) => (
        <div key={i} className="feature-card">
          <div className="feature-icon-wrapper">{f.icon}</div>
          <h4 className="feature-title">{f.title}</h4>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
