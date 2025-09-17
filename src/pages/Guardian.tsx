// src/pages/Guardian.tsx
import React, { useEffect, useState, useRef } from "react";
import { MapPin, WifiOff, Battery, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startGPSWatch, stopGPSWatch, GPSPosition } from "@/utils/GPS";

/**
 * Guardian page:
 * - shows current GPS
 * - finds nearest police/hospital/shelter via Overpass API
 * - allows sharing location to Home or to nearest services via POST to /api/share-location
 *
 * Replace `HOME_CONTACT` and `/api/share-location` with your actual values.
 */

type LatLngTuple = [number, number];

const HOME_CONTACT = {
  name: "Home",
  // Replace with your home's coordinates
  coords: [32.2422, 77.1887] as LatLngTuple,
  address: "My Home Address, City, Country",
  contactEndpoint: "mailto:you@example.com", // just an example; backend will handle actual sending
};

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

function haversineDistance(
  [lat1, lon1]: LatLngTuple,
  [lat2, lon2]: LatLngTuple
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function queryOverpass(
  lat: number,
  lon: number,
  tagQuery: string,
  radiusMeters = 5000
) {
  // Overpass QL — look for nodes/ways/relations matching the tagQuery around the point
  const q = `
    [out:json][timeout:25];
    (
      node(around:${radiusMeters},${lat},${lon})${tagQuery};
      way(around:${radiusMeters},${lat},${lon})${tagQuery};
      relation(around:${radiusMeters},${lat},${lon})${tagQuery};
    );
    out center;
  `;
  const res = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: q,
  });

  if (!res.ok) throw new Error(`Overpass request failed: ${res.status}`);

  const data = await res.json();
  return data.elements || [];
}

export default function GuardianPage() {
  const [isSharing, setIsSharing] = useState(false);
  const [position, setPosition] = useState<null | {
    coords: LatLngTuple;
    accuracy: number;
  }>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [nearest, setNearest] = useState<{
    type: "police" | "hospital" | "shelter";
    name?: string;
    coords?: LatLngTuple;
    distanceKm?: number;
  } | null>(null);
  const [loadingNearest, setLoadingNearest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    // Start watching position when page mounts
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          if (!isMounted.current) return;
          setPosition({
            coords: [pos.coords.latitude, pos.coords.longitude],
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          setError(err.message || "Geolocation error");
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
      setWatchId(id);
    } else {
      setError("Geolocation not supported in this browser.");
    }

    return () => {
      isMounted.current = false;
      if (watchId !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSharing = () => setIsSharing((s) => !s);

  const handleSOS = async () => {
    if (!position) {
      alert("Current location unknown. Wait a moment for GPS fix.");
      return;
    }
    // Send to your backend to notify emergency contacts
    try {
      const payload = {
        to: "emergency-contacts",
        lat: position.coords[0],
        lng: position.coords[1],
        accuracy: position.accuracy,
        message: "SOS — immediate help needed",
      };
      await fetch("/api/share-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("SOS sent to emergency contacts (via /api/share-location).");
    } catch (e) {
      console.error(e);
      alert(
        "Failed to send SOS. If this is urgent, call local emergency services."
      );
    }
  };

  const shareToHome = async () => {
    if (!position) {
      alert("Waiting for GPS fix...");
      return;
    }
    try {
      const payload = {
        to: "home",
        recipientName: HOME_CONTACT.name,
        recipientAddress: HOME_CONTACT.address,
        lat: position.coords[0],
        lng: position.coords[1],
        accuracy: position.accuracy,
        timestamp: new Date().toISOString(),
      };
      await fetch("/api/share-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(`Location shared to ${HOME_CONTACT.name}`);
    } catch (e) {
      console.error(e);
      alert("Failed to share to home — backend unreachable.");
    }
  };

  // Finds nearest service of given type and returns simple object
  const findNearestService = async (
    type: "police" | "hospital" | "shelter"
  ) => {
    if (!position) {
      alert("Waiting for GPS fix...");
      return;
    }
    setLoadingNearest(true);
    setNearest(null);
    setError(null);

    try {
      const [lat, lon] = position.coords;
      let tagQuery = "";
      if (type === "police") {
        tagQuery = '["amenity"="police"]';
      } else if (type === "hospital") {
        // hospitals and clinics
        tagQuery = '["amenity"~"hospital|clinic|doctors|healthcare"]';
      } else if (type === "shelter") {
        // emergency shelter or community shelter tags
        tagQuery =
          '["amenity"~"shelter|community_centre|place_of_worship|emergency"]';
      }

      const elements = await queryOverpass(lat, lon, tagQuery, 10000); // 10km radius
      if (!elements || elements.length === 0) {
        setError(`No ${type} found within 10km.`);
        return null;
      }

      // Convert each element to a coordinate pair (turf/overpass may return center or lat/lon)
      const candidates = elements
        .map((el: any) => {
          const coords: LatLngTuple | null =
            el.type === "node"
              ? ([el.lat, el.lon] as LatLngTuple)
              : el.center
              ? ([el.center.lat, el.center.lon] as LatLngTuple)
              : el.bounds
              ? ([el.bounds.minlat, el.bounds.minlon] as LatLngTuple)
              : null;
          if (!coords) return null;
          const name =
            (el.tags && (el.tags.name || el.tags["operator"])) || `${type}`;
          const dist = haversineDistance(position.coords, coords);
          return { el, coords, name, distanceKm: dist };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.distanceKm - b.distanceKm);

      if (candidates.length === 0) {
        setError(`No ${type} found with usable coordinates.`);
        return null;
      }

      const nearestCandidate = candidates[0];
      const result = {
        type,
        name: nearestCandidate.name,
        coords: nearestCandidate.coords,
        distanceKm: Number(nearestCandidate.distanceKm.toFixed(2)),
      };

      if (isMounted.current) setNearest(result);
      return result;
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to query map service.");
      return null;
    } finally {
      setLoadingNearest(false);
    }
  };

  const shareToNearest = async (
    serviceType: "police" | "hospital" | "shelter"
  ) => {
    if (!position) {
      alert("Waiting for GPS fix...");
      return;
    }
    const found = await findNearestService(serviceType);
    if (!found || !found.coords) {
      alert(`Could not find nearest ${serviceType}.`);
      return;
    }

    try {
      const payload = {
        to: serviceType,
        serviceName: found.name,
        serviceCoords: { lat: found.coords[0], lng: found.coords[1] },
        userCoords: {
          lat: position.coords[0],
          lng: position.coords[1],
          accuracy: position.accuracy,
        },
        message: `User needs help. Sharing live location.`,
      };
      await fetch("/api/share-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(
        `Shared your location with nearest ${serviceType}: ${found.name} (${found.distanceKm} km)`
      );
    } catch (e) {
      console.error(e);
      alert("Failed to share to service. Backend may be unreachable.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-safety/10 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Guardian Mode
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your live GPS to trusted contacts and nearby emergency
            services.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-semibold">Live GPS</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {position
              ? `${position.coords[0].toFixed(6)}, ${position.coords[1].toFixed(6)}`
              : "Waiting for GPS..."}
          </p>
          <p className="text-xs text-muted-foreground">
            {position ? `Accuracy: ${Math.round(position.accuracy)} m` : ""}
          </p>
          <Button onClick={toggleSharing} className="mt-4">
            {isSharing ? "Stop Sharing" : "Start Sharing"}
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Share to</h2>

          <div className="flex flex-wrap gap-3">
            <Button onClick={shareToHome}>Share to Home</Button>

            <Button
              onClick={() => shareToNearest("police")}
              disabled={loadingNearest}
            >
              Share to nearest Police
            </Button>

            <Button
              onClick={() => shareToNearest("hospital")}
              disabled={loadingNearest}
            >
              Share to nearest Hospital / Ambulance
            </Button>

            <Button
              onClick={() => shareToNearest("shelter")}
              disabled={loadingNearest}
            >
              Share to nearest Shelter (disaster)
            </Button>
          </div>

          <div className="mt-4">
            {loadingNearest && (
              <p className="text-sm text-muted-foreground">
                Finding nearest service…
              </p>
            )}
            {error && <p className="text-sm text-red-600">Error: {error}</p>}
            {nearest && (
              <div className="text-sm">
                Nearest {nearest.type}: {nearest.name} — {nearest.distanceKm} km
                away.
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Guardian Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
