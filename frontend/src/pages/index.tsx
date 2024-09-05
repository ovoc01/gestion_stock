import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export default function IndexPage() {
  const center = {
    lat: -18.8700119,
    lng: 47.5211247
  }

  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      height:'100vh'
    }}>
      <MapContainer center={center} zoom={13}  style={{
        width: '85%',
        height: '60%'
      }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />
        <div onClick={()=>{
          console.log('position clicked')
        }}>
        <Marker position={center} >
          
        </Marker>
        </div>
        
      </MapContainer>
      

    </div>

  );
}

