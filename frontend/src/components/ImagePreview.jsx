import React, { useState, useEffect } from "react";
import { X, FileImage, Layers, Eye } from "lucide-react";

export default function ImagePreview({ file, onRemove, landscape }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setDimensions(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Calculate natural image dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file || !previewUrl) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="preview-title-box">
          <FileImage className="icon-preview-title" />
          <span className="preview-label">Selected Image</span>
        </div>
        <button
          className="btn-remove"
          onClick={onRemove}
          title="Remove and choose another image"
          type="button"
        >
          <X size={18} />
          <span>Remove</span>
        </button>
      </div>

      <div className={`preview-card-body ${landscape ? "preview-landscape-mode" : "preview-portrait-mode"}`}>
        <div className="preview-image-wrapper">
          <img src={previewUrl} alt={file.name} className="preview-img" />
          <div className="preview-orientation-overlay">
            <span>{landscape ? "Landscape PDF Layout" : "Portrait PDF Layout"}</span>
          </div>
        </div>

        <div className="preview-meta">
          <div className="meta-item">
            <span className="meta-label">File Name:</span>
            <span className="meta-value filename-truncate" title={file.name}>
              {file.name}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">File Size:</span>
            <span className="meta-value">{formatFileSize(file.size)}</span>
          </div>
          {dimensions && (
            <div className="meta-item">
              <span className="meta-label">Dimensions:</span>
              <span className="meta-value">
                {dimensions.width} &times; {dimensions.height} px
              </span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">PDF Page Orientation:</span>
            <span className="meta-value orientation-tag">
              {landscape ? "Landscape (Horizontal)" : "Portrait (Vertical)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
