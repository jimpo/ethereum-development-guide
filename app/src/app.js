import _bootstrap from 'bootstrap/less/bootstrap.less';
import _style from './style.less';

import React from 'react';
import ReactDOM from 'react-dom';

import BoxView from './components/button';
import {hueForCountdown} from './util';


function Application({havePressed, pressTime, remainingTime, totalTime}) {
  let color;
  if (havePressed) {
    const hue = hueForCountdown(pressTime, totalTime);
    color = `hsl(${hue},100%,75%)`;
  } else {
    color = 'lightgray';
  }

  return (
    <div className="application" style={{backgroundColor: color}}>
      <BoxView
        havePressed={havePressed}
        remainingTime={remainingTime}
        totalTime={totalTime}
      />
    </div>
  );
};

var props = {
  havePressed: true,
  pressTime: 1000,
  remainingTime: 2000,
  totalTime: 3600
};
window.addEventListener('load', () => {
  ReactDOM.render(
    <Application {...props}/>,
    document.getElementById('main')
  );
});
