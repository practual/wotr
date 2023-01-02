import React from 'react';


export default function DiceBox({dice, diceClass, onDieClicked}) {
    const DiceClass = diceClass;
    return (
        <div>
            {dice.reduce((acc, el) => {
                if (el.face !== 'eye') {
                    acc.push(<DiceClass key={el.id} die={el} onClick={el.used ? undefined : () => onDieClicked(el)} />);
                }
                return acc;
            }, [])}
        </div>
    );
}
