import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';


export default function Home(props) {
    const navigate = useNavigate();

    function createGame() {
        fetch(`/api/game`, {method: 'POST'}).then(response => response.text()).then(gameId => {
            navigate(gameId);
        });
    }

    return (
        <button onClick={createGame}>Create game</button>
    );
}
