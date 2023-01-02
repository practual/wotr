import React from 'react';

import ShadowDie from '../dice/shadow-die';

import './hunt-box.css';


export default function HuntBox({shadowDice, freeDice}) {
    return (
        <div styleName="hunt-box">
            {shadowDice.reduce((acc, el) => {
                if (el.face === 'eye') {
                    el.used = false;
                    acc.push(<ShadowDie key={el.id} die={el} />);
                }
                return acc;
            }, [])}
        </div>
    );
}
