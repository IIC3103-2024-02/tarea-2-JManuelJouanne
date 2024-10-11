import React, { useContext } from 'react';
import { WebSocketContext } from '../connection/websocket';

export default function Flights() {
    const { flights } = useContext(WebSocketContext);
    const sortedFlights = flights.sort((a, b) => {
        const departureA = a.departure.name.toLowerCase();
        const departureB = b.departure.name.toLowerCase();
        if (departureA < departureB) return -1;
        if (departureA > departureB) return 1;

        const destinationA = a.destination.name.toLowerCase();
        const destinationB = b.destination.name.toLowerCase();
        if (destinationA < destinationB) return -1;
        if (destinationA > destinationB) return 1;

        return 0;
    });

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Flights</h1>
            <table className="table table-striped table-hover fs-6 text-start">
                <thead className="table-dark">
                    <tr>
                        <th>Flight</th>
                        <th>Departure</th>
                        <th>Destination</th>
                        <th>Departure Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFlights.map((flight) => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>{flight.departure.name}</td>
                            <td>{flight.destination.name}</td>
                            <td>{flight.departure_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}