import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import ImageToPdfView from "./components/ImageToPdfView";
import { checkBackendHealth } from "./services/imageToPdfApi";

export default function App() {
  const [activeView, setActiveView] = useState("home"); // "home" | "image-to-pdf"
  const [backendStatus, setBackendStatus] = useState({ online: true, checking: true });

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const res = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus({ online: res.online, checking: false, error: res.error });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="notebook-wrapper">
      {/* Red margin line on the left simulating lined ruled paper */}
      <div className="notebook-margin-line"></div>

      <div className="page-container">
        {activeView === "home" ? (
          <HomeView
            onSelectService={(serviceKey) => {
              if (serviceKey === "image-to-pdf") {
                setActiveView("image-to-pdf");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            backendStatus={backendStatus}
          />
        ) : (
          <ImageToPdfView
            onBackToHome={() => {
              setActiveView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            backendStatus={backendStatus}
          />
        )}
      </div>
    </div>
  );
}

