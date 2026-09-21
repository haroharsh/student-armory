import React from "react";
import logoImg from "../assets/logo.png";
import { Shield, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function Navbar({ backendStatus }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="brand-group">
          <div className="brand-logo-wrapper">
            <img
              src={logoImg}
              alt="Student Armory Logo"
              className="brand-logo"
            />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Student Armory</h1>
            <span className="brand-subtitle">Image to PDF Converter</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-badge ${backendStatus.online ? "status-online" : "status-offline"}`}>
            {backendStatus.online ? (
              <>
                <span className="status-dot green"></span>
                <span className="status-text">Backend Active</span>
              </>
            ) : (
              <>
                <span className="status-dot red"></span>
                <span className="status-text">Backend Offline</span>
              </>
            )}
          </div>

          <div className="apyhub-badge">
            <Sparkles className="icon-tiny" />
            <span>Powered by ApyHub</span>
          </div>
        </div>
      </div>
    </header>
  );
}
