"use client";

import { useState } from "react";
import { MapPin, LocateFixed, X } from "lucide-react";
import type { Location } from "@/lib/types";

const PRESET_CITIES = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai"];

export function LocationSelector({
  location,
  onChange,
}: {
  location: Location;
  onChange: (loc: Location) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  function selectCity(city: string) {
    onChange({ city, label: city });
    setOpen(false);
  }

  function submitPincode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setGeoError("Enter a valid 6-digit pincode.");
      return;
    }
    onChange({ pincode: pincode.trim(), label: pincode.trim() });
    setOpen(false);
  }

  function useMyLocation() {
    setGeoError(null);
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocating(true);
    // Only requested on explicit click — never on page load, never repeated
    // automatically (spec section 11: no continuous tracking).
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange({
          lat: Math.round(pos.coords.latitude * 1000) / 1000,
          lng: Math.round(pos.coords.longitude * 1000) / 1000,
          label: "Current location",
        });
        setOpen(false);
      },
      () => {
        setLocating(false);
        setGeoError("Couldn't get your location. Try a pincode or city instead.");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:shadow"
      >
        <MapPin size={16} className="text-brand-600" />
        {location.label}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-50 mt-2 w-72 animate-fade-in rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-900">Choose location</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={16} />
              </button>
            </div>

            <button
              onClick={useMyLocation}
              disabled={locating}
              className="mb-3 flex w-full items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
            >
              <LocateFixed size={16} />
              {locating ? "Locating…" : "Use my current location"}
            </button>

            <form onSubmit={submitPincode} className="mb-3 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                inputMode="numeric"
                maxLength={6}
                className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Go
              </button>
            </form>
            {geoError && <p className="mb-2 text-xs text-red-600">{geoError}</p>}

            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Popular cities
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => selectCity(city)}
                  className="rounded-lg px-2.5 py-1.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-100"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
