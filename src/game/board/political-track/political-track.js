import React, {useContext} from 'react';

import GameContext from '../../game-context';
import Step from './step';


export default function PoliticalTrack({side, onMuster}) {
    const game = useContext(GameContext);

    const nationsByDistance = Object.entries(game.board.political_track).reduce((acc, [nationId, nation]) => {
        acc[nation.distance][nationId] = nation;
        return acc;
    }, {0: {}, 1: {}, 2: {}, 3: {}});

    return (
        <div>
            {[...Array(4)].map((_, i) => (
                <Step key={i} nations={nationsByDistance[3-i]} side={side} onMuster={onMuster} />
            ))}
        </div>
    );
}
