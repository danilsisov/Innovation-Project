import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'
import "../css/map.css";
import geoJson from "./data/test.json"
const MapboxTraffic = require('@mapbox/mapbox-gl-traffic');

//Mapbox token
mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWxzaDQiLCJhIjoiY2xhNW5tOGp1MWI5NTN3bWJ4eHdvb2FmcCJ9.oKU58CmaweO00XNcQUu3MQ";

const MainMap = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/danilsh4/cla5nphbi002f14l7kiw5assi",
      center: [24.9370865, 60.1865450],
      zoom: 10,
      maxPitch: 75
    });

    // Station markers from json
    geoJson.features.map((feature) =>
      new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
    );

    //Default red markers, represent storages A B C
    new mapboxgl.Marker({"color" : "#b40219"})
        .setLngLat([24.902729, 60.250690])
        .addTo(map)
    new mapboxgl.Marker({"color" : "#b40219"})
        .setLngLat([25.048008, 60.249280])
        .addTo(map)
    new mapboxgl.Marker({"color" : "#b40219"})
        .setLngLat([24.937641, 60.206252])
        .addTo(map)

    //Navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    //Online traffic 
    map.addControl(new MapboxTraffic());

    // Add full screen toggle to make the map fullscreen
    map.addControl(new mapboxgl.FullscreenControl());

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MainMap;
