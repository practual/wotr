import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import socket from '../../socket';
import FreeDie from '../dice/free-die';
import ShadowDie from '../dice/shadow-die';
import DiceBox from './dice-box';
import HuntBox from './hunt-box';
import PoliticalTrack from './political-track/political-track';


export default function Board({game}) {
    const {activePlayerId, gameId} = useParams();
    const [activeDieId, setActiveDieId] = useState(null);
    const [activeDieChoice, setActiveDieChoice] = useState('');

    useEffect(() => {
        setActiveDieId(null);
        setActiveDieChoice('');
    }, [game.turn.priority]);

    const sideVariables = {
        shadow: {
            side: 'shadow',
            diceClass: ShadowDie,
        },
        free: {
            side: 'free',
            diceClass: FreeDie,
        }
    };

    const playerSide = game.players[activePlayerId].side;
    const opponentSide = {
        shadow: 'free',
        free: 'shadow',
    }[playerSide];

    const dieChoice = activeDieChoice || activeDieId !== null && game.sides[playerSide].dice[activeDieId].face;

    let prompt;
    switch (game.turn.phase) {
        case 'hunt':
            prompt = playerSide === 'shadow' ? (
                <div>
                    Select dice to place into the Hunt Box.
                    <button onClick={() => socket.emit('hunt_dice_placed', gameId)}>Done</button>
                </div>
            ) : (
                <div>Waiting for the Shadow player to place dice into the Hunt Box.</div>
            );
            break;
        case 'action':
            console.log(activeDieChoice || (activeDieId && game.sides[playerSide].dice[activeDieId].face));
            if (game.turn.priority === playerSide) {
                if (dieChoice === 'muster/army') {
                    prompt = (
                        <div>
                            Choose either the <a onClick={() => setActiveDieChoice('muster')}>Muster</a> or <a onClick={() => setActiveDieChoice('army')}>Army</a> action.
                        </div>
                    );
                }
                else if (dieChoice === 'muster') {
                    prompt = (
                        <div>
                            Choose a diplomatic action, an event card or a settlement for reinforcements.
                        </div>
                    );
                }
                else if (Object.values(game.sides[playerSide].dice).filter(die => !die.used).length < Object.values(game.sides[opponentSide].dice).filter(die => !die.used).length) {
                    prompt = (
                        <div>
                            Select an Action die to use or <a onClick={() => socket.emit('pass_priority', gameId)}>pass</a>.
                        </div>
                    );
                } else {
                    prompt = <div>Select an Action die to use.</div>;
                }
            } else {
                prompt = <div>Waiting for your opponent...</div>;
            }
            break;
    }

    const PlayerDie = sideVariables[playerSide].diceClass;
    const OpponentDie = sideVariables[opponentSide].diceClass;

    const onDieClicked = die => {
        if (game.turn.phase === 'hunt' && playerSide === 'shadow') {
            socket.emit('place_hunt_die', gameId);
        } else if (game.turn.phase === 'action' && game.turn.priority === playerSide) {
            setActiveDieId(die.id);
        }
    };

    return (
        <div>
            <DiceBox dice={Object.values(game.sides[opponentSide].dice)} diceClass={OpponentDie} />
            {prompt}
            <PoliticalTrack
                side={dieChoice === 'muster' ? playerSide : undefined}
                onMuster={nationId => socket.emit('diplomatic_action', gameId, activePlayerId, nationId, activeDieId)}
            />
            <HuntBox shadowDice={Object.values(game.sides.shadow.dice)} />
            <DiceBox dice={Object.values(game.sides[playerSide].dice)} diceClass={PlayerDie} onDieClicked={onDieClicked} />
        </div>
    );
}
