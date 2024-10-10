import { latLngBounds } from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

export interface MapMarker {
  position: { lat: number; lng: number };
  popupContent?: React.ReactNode; // Allow custom content in the popup
}

type MapProps = {
  center: { lat: number; lng: number };
  zoom?: number; // Initial zoom level
  markers?: MapMarker[]; // Array of markers
  mousePosition?: boolean; // Show/hide mouse position display
  maxMarkers?: number; // Maximum number of markers to display
  setMarkers?: (markers: MapMarker[]) => void; // Callback to update markers
  setNewMarker?: (marker: MapMarker) => void;
  className?: string;
};

function MousePositionDisplay() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useMapEvents({
    mousemove: (e) => {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <div className="leaflet-top leaflet-right">
      <div className="bg-gray-800 text-white p-2 rounded-md">
        Latitude: {position.lat.toFixed(6)}, Longitude:{" "}
        {position.lng.toFixed(6)}
      </div>
    </div>
  );
}

function AddMarker({
  markers,
  setNewMarker,
}: {
  markers: MapMarker[];
  setMarkers: (markers: MapMarker[]) => void;
  setNewMarker: (marker: MapMarker) => void;
}) {
  const [marker, setMarker] = useState<MapMarker | null>(null);

  useMapEvents({
    click: (e) => {
      if (markers) {
        if (markers.length >= 1) {
          markers.pop();
        }
        setNewMarker({ position: e.latlng });
        setMarker({ position: e.latlng });
      }
    },
  });

  return (
    marker && (
      <Marker position={marker?.position!}>
        {marker?.popupContent && <Popup>{marker.popupContent}</Popup>}
      </Marker>
    )
  );
}

export default function Map({
  center,
  zoom = 15,
  markers = [],
  mousePosition = true,
  setMarkers,
  setNewMarker,
  className,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      // Create a LatLngBounds object from your markers
      const bounds = latLngBounds(markers.map((marker) => marker.position));

      // Fit the map to the calculated bounds
      mapRef.current.fitBounds(bounds);
    }
  }, [markers]);

  return (
    <MapContainer
      ref={mapRef}
      scrollWheelZoom
      center={[center.lat, center.lng]}
      className={["min-w-80 h-[400px] rounded-sm", className].join(" ")}
      zoom={zoom}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers!.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      ))}

      {mousePosition && <MousePositionDisplay />}
      {
        <AddMarker
          markers={markers}
          setMarkers={setMarkers!}
          setNewMarker={setNewMarker!}
        />
      }
    </MapContainer>
  );
}
