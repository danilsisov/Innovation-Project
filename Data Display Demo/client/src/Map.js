import './Map.css';
import * as maplibregl from "maplibre-gl";
import * as arcgisRest1 from "@esri/arcgis-rest-request";
import * as arcgisRest2 from "@esri/arcgis-rest-routing";
import {useEffect} from "react";

function Map() {
    useEffect(() => {
        const apiKey = "AAPKcb0d68045f30492aa85ec2488ca8240cQNND0CXrHDscoALO9gyHHLacMEgD6YuZ_Vxt3GS3gu5brdqCNBqm2R1CnyQrgPW9";
        const basemapEnum = "ArcGIS:Navigation";
        const map = new maplibregl.Map({
            container: "map",
            style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`,
            zoom: 5,
            center: [2.3522, 48.8566]
        });
        let link_mapcss = document.createElement('link');
        link_mapcss.href = "https://unpkg.com/maplibre-gl@2.1.9/dist/maplibre-gl.css";
        link_mapcss.async = true;
        document.body.appendChild(link_mapcss);

        function addCircleLayers() {
            map.addSource("start", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });
            map.addSource("end", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });

            map.addLayer({
                id: "start-circle",
                type: "circle",
                source: "start",
                paint: {
                    "circle-radius": 6,
                    "circle-color": "white",
                    "circle-stroke-color": "black",
                    "circle-stroke-width": 2
                }
            });

            map.addLayer({
                id: "end-circle",
                type: "circle",
                source: "end",
                paint: {
                    "circle-radius": 7,
                    "circle-color": "black"
                }
            });

        }

        function addRouteLayer() {
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });

            map.addLayer({
                id: "route-line",
                type: "line",
                source: "route",
                paint: {
                    "line-color": "hsl(205, 100%, 50%)",
                    "line-width": 4,
                    "line-opacity": 0.6
                }
            })
        }

        function updateRoute() {
            const authentication = arcgisRest1.ApiKeyManager.fromKey(apiKey);
            arcgisRest2
                .solveRoute({
                    stops: [startCoords, endCoords],
                    endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
                    authentication
                })

                .then((response) => {
                    map.getSource("route").setData(response.routes.geoJson);
                })
        }

        map.on("load", () => {
            addCircleLayers();
            addRouteLayer();
        });

        let currentStep = "start";
        let startCoords, endCoords;

        startCoords = [2.3522, 48.8566];
        endCoords = [5.3698, 43.2965]

        updateRoute(startCoords, endCoords);
    })

    return (
        <div id="map"></div>
    );
}

export default Map;