import { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [flights, setFlights] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [takeoffs, setTakeoffs] = useState([]);
    const [landings, setLandings] = useState([]);
    const [crashes, setCrashes] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [websocket, setWs] = useState(null);

    useEffect(() => {
        console.log('useEffect is running');
        const ws = new WebSocket('wss://tarea-2.2024-2.tallerdeintegracion.cl/connect');
        setWs(ws);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            const joinEvent = {
                type: 'join',
                id: '20638760',
                username: 'jmjouanne'
            };
            ws.send(JSON.stringify(joinEvent));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log('Received message:');

            switch (data.type) {
                case 'flights':
                    console.log('Received flights:', data.flights[0], '...');
                    setFlights((prevFlights) => {
                        // const flightsUpdates = [...prevFlights];
                        const flightsUpdates = [];

                        Object.entries(data.flights).forEach(([id, flight]) => {
                            const existingFlightIndex = flightsUpdates.findIndex((f) => f.id === id);
                            if (existingFlightIndex !== -1) {
                                flightsUpdates[existingFlightIndex] = flight;
                            } else {
                                flightsUpdates.push(flight);
                            }
                        });
                        return flightsUpdates;
                    });
                    break;

                case 'plane':
                    console.log('Received plane:', data.plane.flight_id);
                    setPlanes((prevPlanes) => {
                        const planeIndex = prevPlanes.findIndex((p) => p.flight_id === data.plane.flight_id);
                        const planesUpdates = [...prevPlanes];
                        if (planeIndex !== -1) {
                            planesUpdates[planeIndex] = data.plane;
                        } else {
                            planesUpdates.push(data.plane);
                        }
                        return planesUpdates;
                    })
                    setRoutes((prevRoutes) => [...prevRoutes, data.plane.position]);
                    break;

                case 'takeoff':
                    console.log('Received takeoff:', data.flight_id);
                    setTakeoffs((prevTakeoffs) => [...prevTakeoffs, data.flight_id]);
                    break;

                case 'landing':
                    console.log('Received landing:', data.flight_id);
                    setLandings((prevLandings) => [...prevLandings, data.flight_id]);
                    break;

                case 'crash':
                    console.log('Received crash:', data.flight_id);
                    setCrashes((prevCrashes) => [...prevCrashes, data.flight_id]);
                    break;

                case 'message':
                    console.log('Received message:', data.message);
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                    break;

                default:
                    console.error('Unknown message type:', data.type);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        }

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        }

        return () => {
            ws.close();
        }
    }, []);

    const sendMessage = (messageContent) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            const message = {
                type: 'chat',
                content: messageContent,
            };
            websocket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return (
        <WebSocketContext.Provider value={{messages, flights, planes, takeoffs, landings, crashes, routes, sendMessage}}>
            {children}
        </WebSocketContext.Provider>
    );
}
