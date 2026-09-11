"use client";

import { useCallback, useEffect, useState } from "react";
import type { Location } from "@/lib/types";

const STORAGE_KEY = "whyq_location";

const DEFAULT_LOCATION: Location = { city: "Bengaluru", label: "Bengaluru" };

function readStoredLocation(): Location {
  if (typeof window === "undefined") return DEFAULT_LOCATION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LOCATION;
    const parsed = JSON.parse(raw) as Location;
    return parsed.label ? parsed : DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

/**
 * Minimal, localStorage-backed location state. We deliberately store only
 * what's needed to search (pincode/city/area label, or a coarse lat/lng) —
 * no continuous tracking, no server-side persistence of precise coordinates
 * (spec section 11).
 */
export function useLocation() {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocationState(readStoredLocation());
    setHydrated(true);
  }, []);

  const setLocation = useCallback((next: Location) => {
    setLocationState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode, etc.) — location still
      // works for this session via state.
    }
  }, []);

  return { location, setLocation, hydrated };
}
