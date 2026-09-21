import React from "react";
import { RectangleVertical, RectangleHorizontal, Check } from "lucide-react";

export default function OrientationSelector({ landscape, setLandscape, disabled }) {
  return (
    <div className="orientation-section">
      <div className="section-heading">
        <label className="section-title">Select PDF Page Orientation</label>
        <span className="section-hint">Choose how your image will fit into the PDF document</span>
      </div>

      <div className="orientation-grid">
        {/* Portrait Option */}
        <div
          className={`orientation-card ${!landscape ? "orientation-card-selected" : ""} ${
            disabled ? "orientation-card-disabled" : ""
          }`}
          onClick={() => !disabled && setLandscape(false)}
          role="button"
          tabIndex={0}
        >
          <div className="orientation-icon-box">
            <RectangleVertical className="icon-orientation" size={32} />
          </div>
          <div className="orientation-details">
            <div className="orientation-header-row">
              <span className="orientation-name">Portrait</span>
              {!landscape && <span className="selected-check"><Check size={16} /></span>}
            </div>
            <p className="orientation-desc">Vertical layout &mdash; ideal for receipts, documents, and portraits</p>
          </div>
        </div>

        {/* Landscape Option */}
        <div
          className={`orientation-card ${landscape ? "orientation-card-selected" : ""} ${
            disabled ? "orientation-card-disabled" : ""
          }`}
          onClick={() => !disabled && setLandscape(true)}
          role="button"
          tabIndex={0}
        >
          <div className="orientation-icon-box">
            <RectangleHorizontal className="icon-orientation" size={32} />
          </div>
          <div className="orientation-details">
            <div className="orientation-header-row">
              <span className="orientation-name">Landscape</span>
              {landscape && <span className="selected-check"><Check size={16} /></span>}
            </div>
            <p className="orientation-desc">Horizontal layout &mdash; ideal for screenshots, slides, and charts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
