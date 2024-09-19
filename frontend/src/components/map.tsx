import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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
   </MapContainer>
}