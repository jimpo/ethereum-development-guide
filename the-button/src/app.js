import _bootstrap from 'bootstrap/less/bootstrap.less';
import _style from './style.less';

import React from 'react';
import ReactDOM from 'react-dom';

import ApplicationView from './components/application';
import {initialize, onPress} from './state';


class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initialized: false};
  }

  componentDidMount() {
    initialize(this.setState.bind(this));
  }

  onPress() {
    const {account, lastPress} = this.state;
    onPress(this.setState.bind(this), account, lastPress);
  }

  render() {
    return <ApplicationView {...this.state} onPress={this.onPress.bind(this)}/>;
  }
}

window.addEventListener('load', () => {
  const mainElement = document.getElementById('main');
  window.contractAddress = mainElement.getAttribute('data-contract-address');
  ReactDOM.render(<Application/>, mainElement);
});
