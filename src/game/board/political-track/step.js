import React from 'react';

import Nation from './nation';

import styles from './step.css';


export default function Step({nations, side, onMuster}) {
    return (
        <div styleName="step">
            {Object.entries(nations).map(([nationId, nation]) => (
                <Nation key={nationId} nationId={nationId} nation={nation} activeSide={side} onMuster={onMuster} />
            ))}
        </div>
    );
}
