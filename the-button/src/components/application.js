import React from 'react';

import BoxView from './button';
import {hueForCountdown} from '../util';


export default function ApplicationView(props) {
  const {pressTime, totalTime} = props;

  let backgroundColor;
  if (pressTime !== 0) {
    const hue = hueForCountdown(totalTime - pressTime, totalTime);
    backgroundColor = `hsl(${hue},100%,75%)`;
  } else {
    backgroundColor = 'lightgray';
  }

  return (
    <div className="application" style={{backgroundColor}}>
      <BoxView {...props}/>
    </div>
  );
}
