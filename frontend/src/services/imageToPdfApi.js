const rawEnvUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/pdf";
const API_BASE_URL = rawEnvUrl.trim().replace(/\/+$/, "");

/**
 * Checks backend health
 */
export async function checkBackendHealth() {
  try {
    const healthUrl = API_BASE_URL.endsWith("/health")
      ? API_BASE_URL
      : `${API_BASE_URL}/health`;

    const response = await fetch(healthUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { online: false, error: "Backend responded with error" };
    const data = await response.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false, error: err.message || "Backend offline" };
  }
}

/**
 * Converts single or multiple image files to PDF via backend proxy/engine
 * @param {File|File[]} files - The image file(s) to convert
 * @param {boolean} landscape - True for landscape, false for portrait
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function convertImageToPdf(files, landscape = false) {
  const fileList = Array.isArray(files) ? files : [files];
  if (!fileList || fileList.length === 0) {
    throw new Error("No image files provided.");
  }

  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append("files", file);
    formData.append("file", file); // for backwards compatibility
  });

  const convertEndpoint = API_BASE_URL.endsWith("/convert")
    ? API_BASE_URL
    : `${API_BASE_URL}/convert`;

  const url = `${convertEndpoint}?landscape=${Boolean(landscape)}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to convert images to PDF";
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      errorMessage = `Conversion failed with status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Determine filename from Content-Disposition header if available
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = fileList.length > 1 ? `student-armory-combined-${fileList.length}-pages.pdf` : "converted.pdf";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  } else if (fileList.length === 1 && fileList[0].name) {
    const base = fileList[0].name.substring(0, fileList[0].name.lastIndexOf('.')) || fileList[0].name;
    filename = `${base}.pdf`;
  }

  const blob = await response.blob();
  return { blob, filename };
}
