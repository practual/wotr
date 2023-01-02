import React, {useState} from 'react';
import {useParams} from 'react-router';

import socket from '../socket';

const Player = props => {
    const {gameId, activePlayerId} = useParams();
    const [side, setSide] = useState('');

    const onSideSelected = e => {
        setSide(e.target.value);
        socket.emit('select_side', gameId, activePlayerId, e.target.value);
    };

    let markReady;
    if (props.player.id === activePlayerId) {
        markReady = (
            <>
                <label>
                    <input type="radio" name="side" value="free" checked={side == 'free'} onChange={onSideSelected} />
                    Free Peoples
                </label>
                <label>
                    <input type="radio" name="side" value="shadow" checked={side == 'shadow'} onChange={onSideSelected} />
                    Shadow
                </label>
            </>
        );
    }

    return (
        <li>
            {props.player.name}{' - '}
            {markReady}
        </li>
    );
};

export default Player;
