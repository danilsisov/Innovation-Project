import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import Map from "react-map-gl";
import "./css/map.css";
import MapLibreGlDirections, { LoadingIndicatorControl } from "@maplibre/maplibre-gl-directions";

export default function ReactMap() {
  const [API_KEY] = useState("delrl8nqQPw0Fe3Yq5Rb");

  const [mapViewport, map] = useState({
    longitude: 24.937086,
    latitude: 60.1865450,
    zoom: 11,
    minZoom: 2,
    maxPitch: 68
  });
  

  return (
    <div className="map-wrap">
      <Map
        initialViewState={{ ...mapViewport }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`}
        mapLib={maplibregl}
        className="map"
      >
      </Map>
    </div>
  );
}