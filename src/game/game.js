import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import socket from '../socket';
import Board from './board/board';
import GameContext from './game-context';
import ReadyPlayers from './ready-players';


export default function Game(props) {
    const {gameId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [game, setGameState] = useState({});

    useEffect(() => {
        if (!isLoading) {
            return;
        }
        fetch(`/api/game/${gameId}`).then(response => response.json()).then(response => {
            setGameState(response);
            setIsLoading(false);
        });
    }, [isLoading]);

    useEffect(() => {
        socket.on('game_state', setGameState);
        return () => {
            socket.off('game_state', setGameState);
        };
    }, []);

    if (isLoading) {
        return null;
    }

    if (!game.turn.number) {
        return <ReadyPlayers players={game.players} />;
    }

    return (
        <GameContext.Provider value={game}>
            <Board game={game} />
        </GameContext.Provider>
    );
}
