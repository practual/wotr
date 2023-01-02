import React, {useEffect, useState} from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Game from './game/game';
import Home from './home';
import socket from './socket';


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path=":gameId" element={<Game />} />
                    <Route path=":gameId/:activePlayerId" element={<Game />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
