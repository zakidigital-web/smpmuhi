"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";

type AgendaItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
};

export default function UpcomingAgenda() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agenda")
      .then((r) => r.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = (data as AgendaItem[])
          .filter((a) => new Date(a.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4);
        setItems(upcoming);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href="/agenda"
          className="rounded-xl p-5 flex items-start gap-4 tap-scale"
          style={{ background: "var(--section-alt)" }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary)" }}>
            <CalendarDays className="w-6 h-6" style={{ color: "white" }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
              {item.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
