import React from 'react';

import Die from './die';
import styles from './shadow-die.css';


export default function ShadowDie(props) {
    return <Die className={styles.die} {...props} />;
}
