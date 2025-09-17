// src/utils/GPS.ts
export type LatLngTuple = [number, number];

export interface GPSPosition {
  coords: LatLngTuple;
  accuracy: number;
  timestamp: number;
}

let watchId: number | null = null;

/**
 * Start watching the GPS location in real-time
 */
export function startGPSWatch(
  onUpdate: (pos: GPSPosition) => void,
  onError?: (err: GeolocationPositionError) => void
) {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocation not supported in this browser.");
  }

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const result: GPSPosition = {
        coords: [pos.coords.latitude, pos.coords.longitude],
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      };
      onUpdate(result);
    },
    (err) => {
      if (onError) onError(err);
      console.error("GPS error:", err);
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );

  return watchId;
}

/**
 * Stop watching GPS updates
 */
export function stopGPSWatch() {
  if (watchId !== null && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}
