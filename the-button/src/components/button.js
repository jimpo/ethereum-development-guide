import classNames from 'classnames';
import React from 'react';

import {formatCountdown, hueForCountdown} from '../util';


function Button({havePressed, remainingTime, onPress}) {
  const disabled = havePressed || remainingTime === 0;

  let glyphiconType;
  if (disabled) {
    glyphiconType = 'glyphicon-lock';
  } else {
    glyphiconType = 'glyphicon-hand-up';
  }

  return (
    <button
      className="the-button btn btn-default btn-lg"
      disabled={disabled}
      onClick={onPress}>
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

class ContractInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isShown: false};
  }

  onClick(e) {
    e.preventDefault();
    this.setState(({isShown}) => ({isShown: !isShown})); // Toggle isShown
  }

  render() {
    const {contract} = this.props;
    return (
      <div className="contract-details">
        <a onClick={this.onClick.bind(this)}>
          {this.state.isShown ? 'Hide ' : 'Show '} contract details
        </a>
        <div className={this.state.isShown ? '' : 'hidden'}>
          <h4>Contract Address</h4>
          <pre><code>{contract.address}</code></pre>
          <h4>Contract ABI</h4>
          <pre><code>
            {JSON.stringify(contract.abi)}
          </code></pre>
        </div>
      </div>
    );
  }
}

export default function BoxView({initialized, error, pressTime, remainingTime, totalTime, onPress, waiting, contract}) {
  let child;
  if (initialized) {
    let waitingAlert;
    if (waiting) {
      waitingAlert = (
        <div className="alert alert-warning">
          Waiting for network to confirm the button press. This will take ~30 seconds.
        </div>
      );
    }

    child = (
      <div className="container-fluid">
        {waitingAlert}
        <div className="row">
          <div className="col-xs-3 col-xs-offset-2">
            <Button
              havePressed={pressTime !== 0}
              remainingTime={remainingTime}
              onPress={onPress}
            />
          </div>
          <div className="col-xs-3 col-xs-offset-2">
            <Timer remainingTime={remainingTime} totalTime={totalTime}/>
          </div>
        </div>
        <ContractInfo contract={contract}/>
      </div>
    );
  } else if (error) {
    child = (
      <div className="alert alert-danger alert-uninitialized">
        {error}
      </div>
    );
  } else {
    child = (
      <div className="alert alert-warning alert-uninitialized">
        Loading data from the Ethereum network...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="box well well-lg">
        {child}
      </div>
    </div>
  );
}
