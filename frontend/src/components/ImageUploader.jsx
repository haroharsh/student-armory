import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, FileCheck } from "lucide-react";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
];

const ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".tif", ".tiff", ".bmp"];
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export default function ImageUploader({ onSelectFile, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const validateAndSelect = (file) => {
    setUploadError("");
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setUploadError("File size exceeds 100 MB. Please choose a smaller image.");
      return;
    }

    const fileExt = "." + file.name.split(".").pop().toLowerCase();
    const isValidType = ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(fileExt);

    if (!isValidType) {
      setUploadError("Unsupported format. Please upload PNG, JPG, JPEG, GIF, SVG, TIFF, or BMP.");
      return;
    }

    onSelectFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="uploader-wrapper">
      <div
        className={`drop-zone ${isDragging ? "drop-zone-active" : ""} ${disabled ? "drop-zone-disabled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleChange}
          style={{ display: "none" }}
          disabled={disabled}
        />

        <div className="drop-icon-wrapper">
          <UploadCloud className="upload-icon-main" />
        </div>

        <h3 className="drop-title">
          Drag & drop your image here, or <span className="highlight-browse">browse</span>
        </h3>
        <p className="drop-subtitle">
          Supports high-resolution PNG, JPG, GIF, SVG, TIFF, & BMP up to 100 MB
        </p>

        <div className="formats-badge-list">
          {["PNG", "JPG", "JPEG", "GIF", "SVG", "TIFF", "BMP"].map((fmt) => (
            <span key={fmt} className="format-badge">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {uploadError && (
        <div className="error-banner">
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
