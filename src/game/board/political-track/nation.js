import React from 'react';


export default function Nation({nationId, nation, activeSide, onMuster}) {
    const canMuster = nation.side === activeSide && nation.distance && (nation.distance > 1 || nation.active);
    return (
        <div onClick={canMuster ? () => onMuster(nationId) : undefined}>
            {`${nation.name} (${nation.active ? 'Active' : 'Passive'})`}
        </div>
    );
}
