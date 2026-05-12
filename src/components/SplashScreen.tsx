"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

export default function SplashScreen() {
  const [hide, setHide] = useState(false);
  const [remove, setRemove] = useState(false);

  useEffect(() => {
    const ready = () => {
      setHide(true);
      setTimeout(() => setRemove(true), 500);
    };

    if (document.readyState === "complete") {
      ready();
    } else {
      window.addEventListener("load", ready);
      return () => window.removeEventListener("load", ready);
    }
  }, []);

  if (remove) return null;

  return (
    <div className={`splash-screen${hide ? " hide" : ""}`}>
      <div className="splash-icon">
        <GraduationCap className="w-10 h-10" style={{ color: "var(--primary)" }} />
      </div>
      <div className="splash-title">SMP Muhammadiyah 1</div>
      <div className="splash-sub">Genteng &mdash; Banyuwangi</div>
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
