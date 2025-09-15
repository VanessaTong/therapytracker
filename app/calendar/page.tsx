"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type Event as RBCEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  format as formatDate,
} from "date-fns";

type Event = RBCEvent & {
  id: string | number;
  start: Date;
  end: Date;
  title: string; // patient name or "Name – Time" after formatting
};

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function TherapistCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const load = useCallback(async (s: Date, e: Date) => {
    const qs = new URLSearchParams({
      start: s.toISOString(),
      end: e.toISOString(),
    });
    const res = await fetch(`/api/appointments?${qs.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch appointments");

    // API returns strings; convert to Date objects here to avoid RBC error
    const data = (await res.json()) as Array<{
      id: string | number;
      title: string;  // patient_name
      start: string;  // ISO string (UTC, ends with Z)
      end: string;    // ISO string (UTC, ends with Z)
    }>;

    const normalized: Event[] = data.map((ev) => {
      const startDate = new Date(ev.start);
      const endDate = new Date(ev.end);
      return {
        id: ev.id,
        start: startDate,
        end: endDate,
        // Show "Name – Time" in the event box
        title: `${ev.title} – ${formatDate(startDate, "h:mm a")}`,
      };
    });

    setEvents(normalized);
  }, []);

  // Initial load: current month
  useEffect(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setHours(23, 59, 59, 999);
    load(start, end);
  }, [load]);

  // Refetch when the visible range changes
  const onRangeChange = (r: any) => {
    if (Array.isArray(r)) {
      const start = new Date(r[0]);
      start.setHours(0, 0, 0, 0);
      const end = new Date(r[r.length - 1]);
      end.setHours(23, 59, 59, 999);
      load(start, end);
    } else if (r?.start && r?.end) {
      load(new Date(r.start), new Date(r.end));
    }
  };

  const eventStyleGetter = useMemo(
    () =>
      () => ({
        style: {
          backgroundColor: "#D8B4FE",
          borderRadius: "6px",
          color: "#3B0764",
          border: "none",
          padding: "2px 4px",
          fontSize: "0.85rem",
        },
      }),
    []
  );

  return (
    <div className="container py-6">
      <h1 className="text-xl font-semibold mb-2">Calendar</h1>
      <p className="text-sm text-gray-600 mb-4">
      </p>

      <div className="card p-3">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onRangeChange={onRangeChange}
          style={{ height: 650 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          popup
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}
