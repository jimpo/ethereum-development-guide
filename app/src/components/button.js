import classNames from 'classnames';
import React from 'react';

import {formatCountdown, hueForCountdown} from '../util';


function Button({havePressed}) {
  let glyphiconType;
  if (havePressed) {
    glyphiconType = 'glyphicon-lock';
  } else {
    glyphiconType = 'glyphicon-hand-up';
  }

  return (
    <button className="the-button btn btn-default btn-lg" disabled={havePressed}>
      <span className={classNames('glyphicon', glyphiconType)}/>
    </button>
  );
}

function Timer({remainingTime, totalTime}) {
  const hue = hueForCountdown(remainingTime, totalTime);
  const color = `hsl(${hue},100%,50%)`;
  return (
    <span className="countdown" style={{color: color}}>
      {formatCountdown(remainingTime)}
    </span>
  );
}

export default function BoxView({havePressed, remainingTime, totalTime}) {
  return (
    <div className="container">
      <div className="box well well-lg">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3 col-xs-offset-2">
              <Button havePressed={havePressed}/>
            </div>
            <div className="col-xs-3 col-xs-offset-2">
              <Timer remainingTime={remainingTime} totalTime={totalTime}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
