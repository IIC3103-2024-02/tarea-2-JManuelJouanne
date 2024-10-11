import { WebSocketContext } from '../connection/websocket';
import { MapContainer, Marker, TileLayer, useMap, Popup, Polyline, CircleMarker } from 'react-leaflet';
import React, { useEffect, useRef, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function FitWorldView() {
    const map = useMap();

    useEffect(() => {
        map.setView([0, 0], 1.5);
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
}

function getIcon(status) {
    if (status === 'flying') {
        return L.icon({
            iconUrl: `/imgs/${status}.png`,
            iconSize: [30, 30],
            iconAnchor: [10, 10],
            rotationAngle: 0,
            rotationOrigin: 'center',
        });
    }
    return L.icon({
        iconUrl: `/imgs/${status}.png`,
        iconSize: [30, 30],
        iconAnchor: [20, 20],
    });
}

export default function Map() {
    const mapRef = useRef(null);
    const { planes, flights, routes } = useContext(WebSocketContext);

    return (
        <MapContainer ref={mapRef} style={{ height: '60vh', width: '100%' }}>
            <FitWorldView />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flights.map((flight, index) => {
                const plane = planes.find((p) => p.flight_id === flight.id);
                if (!plane) return null;

                return (
                    <>
                        <Marker key={index} position={[flight.departure.location.lat, flight.departure.location.long]} icon={getIcon('departure')}>
                            <Popup>
                                <div className='text-xs lh-2'>
                                    <p className='m-0 fw-bold'>Aeropuerto: {flight.departure.name}</p>
                                    <p className='m-0'>Vuelo Saliente: {flight.id}</p>
                                    <p className='m-0'>País: {flight.departure.city.country.name}</p>
                                    <p className='m-0'>Ciudad: {flight.departure.city.name}</p>
                                </div>
                            </Popup>
                        </Marker>

                        <Marker key={index} position={[flight.destination.location.lat, flight.destination.location.long]} icon={getIcon('destiny')}>
                            <Popup>
                                <div className='text-xs lh-2'>
                                    <p className='m-0 fw-bold'>Aeropuerto: {flight.destination.name}</p>
                                    <p className='m-0'>Vuelo Entrante: {flight.id}</p>
                                    <p className='m-0'>País: {flight.destination.city.country.name}</p>
                                    <p className='m-0'>Ciudad: {flight.destination.city.name}</p>
                                </div>
                            </Popup>
                        </Marker>

                        <Polyline 
                            key={`line-${index}`}
                            positions={[[flight.departure.location.lat, flight.departure.location.long], [flight.destination.location.lat, flight.destination.location.long]]}
                            color="gray"
                            weight={1}
                        />

                        <Marker key={index} position={[plane.position.lat, plane.position.long]} icon={getIcon(plane.status)}>
                            <Popup>
                                <div className='text-xs lh-2'>
                                    <p className='m-0 fw-bold'>Vuelo: {plane.flight_id}</p>
                                    <p className='m-0'>Aerolínea: {plane.airline.name}</p>
                                    <p className='m-0'>Capitán: {plane.captain}</p>
                                    <p className='m-0'>ETA: {plane.arrival}</p>
                                    <p className='m-0'>estado: {plane.status}</p>
                                </div>
                            </Popup>
                        </Marker>
                    </>
                )
            }
            )}

            {routes.map((route, index) => {
                return (
                    <CircleMarker key={index} center={[route.lat, route.long]} radius={1} color="#6CB8A6" fillOpacity={0.3}/>
                )

            })}

            {/* {crashes.map((crash, index) => {
                const plane = planes.find((p) => p.flight_id === crash.flight_id);
                if (!plane) return null;
                return (
                    <Marker key={index} position={[plane.position.lat, plane.position.long]} icon={getIcon('crashed')} />
                )
            })} */}
        </MapContainer>
    )
}
