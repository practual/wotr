import React from 'react';

import Die from './die';
import styles from './free-die.css';


export default function FreeDie(props) {
    return <Die className={styles.die} {...props} />;
}
