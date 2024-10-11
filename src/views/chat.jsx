import React, { useContext, useState } from 'react';
import { WebSocketContext } from '../connection/websocket';

export default function Chat() {
    const { messages, sendMessage } = useContext(WebSocketContext);
    const [inputMessage, setInputMessage] = useState('');

    function getInitials(name) {
        const parts = name.split(' ');
        const initials = parts.map(part => part.charAt(0).toUpperCase()).join('');
        return initials;
    }

    const handleMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div className="border rounded p-2 h-100 d-flex flex-column">
            <h1 className="h5">Chat</h1>
            <ul className="list-unstyled overflow-auto" style={{ maxHeight: '400px' }}>
                {messages.map((m) => (
                    <li className='row'>
                        <div className='col-3 border m-2 p-1 rounded-circle text-center align-middle start-100 bg-primary-subtle' style={{ height: '40px', width: '40px'}}>
                            {getInitials(m.name)}
                        </div>
                        <div className={`col-9 fs-6 border m-2 p-2 rounded-4 text-start border border-2 lh-sm ${m.level === 'warn' ? 'bg-danger text-white' : 'bg-primary-subtle'}`}>
                            {m.content}
                            <div className='text-end small'>
                                {m.date.split(' ')[1].split(':').slice(0, 2).join(':')}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleMessage} className="d-flex mt-auto">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Send a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary ms-2">Send</button>
            </form>
        </div>
    );
}