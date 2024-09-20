import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

function MousePositionDisplay() {
   const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

   useMapEvents({
      mousemove: (e) => {
         setPosition(e.latlng);
      },
   });

   return position === null ? null : (
      <div className="leaflet-top leaflet-right">
         <div className="bg-gray-800 text-white p-2 rounded-md">
            Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}
         </div>
      </div>
   );
}

export default function Map() {

   return <MapContainer center={[-18.870134, 47.5205636]} zoom={15} scrollWheelZoom className="min-w-80 h-[400px] rounded-sm">
      <TileLayer
         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[-18.870134, 47.5205636]}>
         <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
         </Popup>
      </Marker>
      <MousePositionDisplay />

   </MapContainer>
}