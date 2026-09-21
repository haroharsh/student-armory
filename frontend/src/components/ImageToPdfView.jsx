import React, { useState, useRef, useEffect } from "react";
import BrandHeader from "./BrandHeader";
import {
  ArrowLeft,
  ArrowUp,
  FileDown,
  X,
  FileImage,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Layers,
  RectangleVertical,
  RectangleHorizontal,
} from "lucide-react";
import { convertImageToPdf } from "../services/imageToPdfApi";

const ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".tif", ".tiff", ".bmp", ".webp"];
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB per file

export default function ImageToPdfView({ onBackToHome, backendStatus }) {
  const [files, setFiles] = useState([]); // Array of File objects
  const [filePreviews, setFilePreviews] = useState([]); // Array of { file, previewUrl, id }
  const [landscape, setLandscape] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convertedPdf, setConvertedPdf] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

  // Generate object URLs for previews
  useEffect(() => {
    const previews = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${index}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFilePreviews(previews);

    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [files]);

  const handleAddFiles = (newFilesList) => {
    setError(null);
    setConvertedPdf(null);

    if (!newFilesList || newFilesList.length === 0) return;

    const validNewFiles = [];
    let errorMsg = null;

    Array.from(newFilesList).forEach((file) => {
      if (file.size > MAX_SIZE_BYTES) {
        errorMsg = `File "${file.name}" exceeds 100 MB limit.`;
        return;
      }
      const fileExt = "." + file.name.split(".").pop().toLowerCase();
      const isValid = ACCEPTED_EXTENSIONS.includes(fileExt) || file.type.startsWith("image/");
      if (!isValid) {
        errorMsg = `File "${file.name}" has an unsupported format.`;
        return;
      }
      validNewFiles.push(file);
    });

    if (errorMsg) {
      setError(errorMsg);
    }

    if (validNewFiles.length > 0) {
      setFiles((prev) => [...prev, ...validNewFiles]);
    }
  };

  const handleRemoveSingleFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setError(null);
    setConvertedPdf(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please select at least one image to convert.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setConvertedPdf(null);

      const { blob, filename } = await convertImageToPdf(files, landscape);
      const url = window.URL.createObjectURL(blob);

      setConvertedPdf({
        blob,
        filename,
        url,
        pageCount: files.length,
      });

      // Auto-trigger download
      triggerDownload(url, filename);
    } catch (err) {
      setError(err.message || "Failed to convert images to PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleReset = () => {
    if (convertedPdf?.url) {
      window.URL.revokeObjectURL(convertedPdf.url);
    }
    setFiles([]);
    setConvertedPdf(null);
    setError(null);
    setLandscape(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="tool-view">
      {/* Header with Top-Left Back Button and Centered Logo */}
      <header className="tool-header">
        <div className="tool-top-row">
          <button className="btn-back-link" onClick={onBackToHome} type="button">
            <ArrowLeft size={18} />
            <span>Back to Arsenal</span>
          </button>
        </div>

        <div className="tool-logo-row">
          <BrandHeader onClick={onBackToHome} />
        </div>

        <div className="tool-title-wrap">
          <h2 className="tool-heading">
            Convert Images to <span className="marker-highlight">PDF</span>
          </h2>
          <p className="tool-subheading">
            Choose single or multiple images to combine into a multi-page PDF document.
          </p>
        </div>
      </header>

      {/* Main Tool Container */}
      <div className="tool-workspace-container">
        <div className="sketch-canvas-box">
          {/* Top tape decoration */}
          <div className="canvas-tape"></div>

          {/* Upload Area (Matches Wireframe Circle Arrow Box when no files selected) */}
          {files.length === 0 ? (
            <div
              className={`wireframe-upload-box ${isDragging ? "upload-box-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_EXTENSIONS.join(",")}
                onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                style={{ display: "none" }}
              />

              {/* Big Circle Up Arrow as in Wireframe */}
              <div className="circle-arrow-btn">
                <ArrowUp size={44} strokeWidth={2.5} />
              </div>

              <div className="upload-prompt-text">
                <span className="upload-main-text">Click or drag images here</span>
                <span className="upload-sub-text">
                  Select multiple PNG, JPG, JPEG, GIF, SVG, TIFF, BMP, or WEBP images
                </span>
              </div>
            </div>
          ) : (
            <div className="image-selected-flow">
              {/* Header Bar with Batch Count & Add More Button */}
              <div className="batch-header-bar">
                <div className="batch-count-pill">
                  <Layers size={18} />
                  <span>
                    <strong>{files.length}</strong> {files.length === 1 ? "Image" : "Images"} selected (Total: {formatFileSize(totalBytes)})
                  </span>
                </div>

                <div className="batch-actions-right">
                  <button
                    type="button"
                    className="btn-add-more-images"
                    onClick={() => addMoreInputRef.current?.click()}
                  >
                    <Plus size={16} />
                    <span>Add More</span>
                  </button>

                  <input
                    ref={addMoreInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_EXTENSIONS.join(",")}
                    onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                    style={{ display: "none" }}
                  />

                  <button type="button" className="btn-sketch-clear" onClick={handleReset} title="Clear all images">
                    <Trash2 size={16} />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Multiple Images Grid / Gallery */}
              <div className="images-gallery-grid">
                {filePreviews.map((item, idx) => (
                  <div key={item.id} className="image-gallery-card">
                    <div className="page-number-badge">Page {idx + 1}</div>
                    <button
                      type="button"
                      className="btn-delete-card-image"
                      onClick={() => handleRemoveSingleFile(idx)}
                      title="Remove this image"
                    >
                      <X size={14} />
                    </button>
                    <div className="gallery-thumb-wrap">
                      <img src={item.previewUrl} alt={item.file.name} className="gallery-thumbnail" />
                    </div>
                    <div className="gallery-card-meta">
                      <span className="card-file-name" title={item.file.name}>
                        {item.file.name}
                      </span>
                      <span className="card-file-size">{formatFileSize(item.file.size)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Orientation Selector */}
              <div className="orientation-picker-box">
                <label className="orientation-picker-label">Page Orientation (Applied to all pages):</label>
                <div className="orientation-toggle-group">
                  <button
                    type="button"
                    className={`orientation-toggle-btn ${!landscape ? "toggle-btn-active" : ""}`}
                    onClick={() => setLandscape(false)}
                  >
                    <RectangleVertical size={18} />
                    <span>Portrait (Vertical)</span>
                  </button>
                  <button
                    type="button"
                    className={`orientation-toggle-btn ${landscape ? "toggle-btn-active" : ""}`}
                    onClick={() => setLandscape(true)}
                  >
                    <RectangleHorizontal size={18} />
                    <span>Landscape (Horizontal)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Convert Button (Matches Wireframe Button) */}
          <div className="wireframe-action-area">
            <button
              type="button"
              className={`btn-wireframe-convert ${loading ? "btn-converting" : ""}`}
              onClick={handleConvert}
              disabled={loading || files.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Converting {files.length > 1 ? `${files.length} Pages` : ""} to PDF...</span>
                </>
              ) : (
                <>
                  <FileDown size={20} />
                  <span>
                    {files.length > 1 ? `Convert ${files.length} images to pdf` : "Convert to pdf"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="sketch-error-box">
              <AlertTriangle size={20} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Box */}
          {convertedPdf && (
            <div className="sketch-success-box">
              <div className="success-icon-badge">
                <CheckCircle size={28} />
              </div>
              <div className="success-content">
                <h4 className="success-heading">
                  {convertedPdf.pageCount > 1
                    ? `${convertedPdf.pageCount}-Page PDF Generated Successfully!`
                    : "PDF Generated Successfully!"}
                </h4>
                <p className="success-sub">
                  Your PDF (<strong>{convertedPdf.filename}</strong>) has downloaded.
                </p>
                <div className="success-btn-row">
                  <button
                    type="button"
                    className="btn-sketch-action"
                    onClick={() => triggerDownload(convertedPdf.url, convertedPdf.filename)}
                  >
                    <FileDown size={16} />
                    <span>Download Again</span>
                  </button>
                  <a
                    href={convertedPdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sketch-action"
                  >
                    <ExternalLink size={16} />
                    <span>Open in New Tab</span>
                  </a>
                  <button type="button" className="btn-sketch-secondary" onClick={handleReset}>
                    <RefreshCw size={16} />
                    <span>Convert More Images</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
