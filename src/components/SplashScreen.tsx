"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

export default function SplashScreen() {
  const [hide, setHide] = useState(false);
  const [remove, setRemove] = useState(false);
  const [schoolName, setSchoolName] = useState("SMP Muhammadiyah 1");
  const [schoolSub, setSchoolSub] = useState("Genteng &mdash; Banyuwangi");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.shortName) {
          const parts = data.shortName.split(" ");
          setSchoolName(parts.slice(0, -1).join(" ") || data.shortName);
          setSchoolSub(parts[parts.length - 1] || "");
        } else if (data?.schoolName) {
          setSchoolName(data.schoolName);
          setSchoolSub("");
        }
        if (data?.logo) setLogo(data.logo);
      })
      .catch(() => {});
  }, []);

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
        {logo ? (
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
        ) : (
          <GraduationCap className="w-10 h-10" style={{ color: "var(--primary)" }} />
        )}
      </div>
      <div className="splash-title">{schoolName}</div>
      {schoolSub && <div className="splash-sub" dangerouslySetInnerHTML={{ __html: schoolSub }} />}
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
