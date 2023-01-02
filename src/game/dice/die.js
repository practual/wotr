import React from 'react';

import styles from './die.css';


export default function Die({className, die, ...props}) {
    let dieClasses = styles.die;
    if (die.used) {
        dieClasses += ` ${styles.used}`;
    }
    if (className) {
        dieClasses += ` ${className}`;
    }
    return (
        <div {...props} className={dieClasses}>{die.face}</div>
    );
}
