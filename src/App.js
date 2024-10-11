import './App.css';
import React from 'react';
import { WebSocketProvider } from './connection/websocket';
import Map from './views/map';
import Flights from './views/flights';
import Chat from './views/chat';


function App() {
  console.log('App is rendering');
  return (
    <div className="App">
      <WebSocketProvider>
        <header className="container">
          <div className='row mt-5 h-75'>
            <div className='col-8'>
              <Map />
            </div>
            <div className='col-4'>
              <Chat />
            </div>
          </div>
          <Flights />
        </header>
      </WebSocketProvider>
    </div>
  );
}

export default App;
