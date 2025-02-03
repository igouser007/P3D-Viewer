import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [viewerActive, setViewerActive] = useState(false);
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    // Ensure `bundle.js` is loaded before using its functions
    if (window.initializeP3DViewer) {
      console.log("P3D Viewer script is loaded!");
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert file to URL and set it for the viewer
    const url = URL.createObjectURL(file);
    setFileURL(url);
    setViewerActive(true);

    // Ensure `bundle.js` function is called
    if (window.initializeP3DViewer) {
      window.initializeP3DViewer(url);
    } else {
      console.error("P3D Viewer is not available");
    }
  };

  return (
    <div className="container">
      {!viewerActive ? (
        <div className="upload-section text-center">
          <h2 className="text-center">Upload Your P3D File</h2>
          {/* <input type="file" onChange={handleFileUpload} accept=".p3d" /> */}
        </div>
      ) : (
        // <div className="viewer-section">
        //   <div className="back-arrow" onClick={() => setViewerActive(false)}>←</div>
        //   <div className="viewer">
        //     <iframe
        //       src={fileURL}
        //       width="100%"
        //       height="100%"
        //       title="P3D Viewer"
        //     ></iframe>
        //   </div>
        // </div>
        ""
      )}
    </div>
  );
};

export default App;
