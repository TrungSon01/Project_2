import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

function LocationMarker({ coords, onPick, picking }) {
  useMapEvents({
    click(e) {
      if (picking) {
        onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      }
    },
  });

  return coords ? (
    <Marker position={[coords.latitude, coords.longitude]} />
  ) : null;
}

export default function MapPicker({ coords, onPick, picking }) {
  return (
    <MapContainer
      center={
        coords ? [coords.latitude, coords.longitude] : [16.0544, 108.2022]
      }
      zoom={15}
      scrollWheelZoom={false}
      style={{
        height: "200px",
        width: "100%",
        borderRadius: "12px",
        border: "1px solid #eee",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker coords={coords} onPick={onPick} picking={picking} />
    </MapContainer>
  );
}
