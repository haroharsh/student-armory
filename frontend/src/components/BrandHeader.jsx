import React from "react";

export default function BrandHeader({ onClick }) {
  return (
    <div className="brand-header-container" onClick={onClick} role="button" tabIndex={0}>
      <div className="logo-stylized-title">
        <span className="logo-word-student">STUDENT</span>
        <span className="logo-word-armory">ARMORY</span>
        <div className="logo-swords-motif">
          {/* Crossed Pen & Sword vector motif styled like the logo */}
          <svg viewBox="0 0 48 48" className="motif-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sword 1 */}
            <path
              d="M10 38L34 14M34 14L37 11L40 14L37 17L34 14ZM10 38L7 41L11 41L10 38ZM14 34L17 37"
              stroke="#991b1b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Quill / Pen Spear 2 */}
            <path
              d="M38 38L14 14M14 14L11 11L8 14L11 17L14 14ZM38 38L41 41L37 41L38 38ZM34 34L31 37"
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="26" r="3" fill="#c23b3b" stroke="#1e293b" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
