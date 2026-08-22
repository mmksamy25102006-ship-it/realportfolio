import { useEffect, useState } from "react";
import "../Intro.css";

export default function Intro({ onFinish }) {
  const [showImage, setShowImage] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowImage(true), 1000);

    const t2 = setTimeout(() => setZoomIn(true), 2000);

    const t3 = setTimeout(() => {
      setZoomIn(false);
      setZoomOut(true);
    }, 3800);

    const t4 = setTimeout(() => {
      onFinish();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div className="intro">

      <h1 className="intro-name">Kumar</h1>

      <div
        className={`
          portal
          ${showImage ? "show-image" : ""}
          ${zoomIn ? "zoom-in" : ""}
          ${zoomOut ? "zoom-out" : ""}
        `}
      >
        <img src="portfolioimage1.png" alt="profile" />
      </div>

    </div>
  );
}