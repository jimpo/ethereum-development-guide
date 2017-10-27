import _bootstrap from 'bootstrap/less/bootstrap.less';
import _style from './style.less';

import React from 'react';
import ReactDOM from 'react-dom';

import ApplicationView from './components/application';


class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initialized: false};
  }

  render() {
    return <ApplicationView {...this.state}/>;
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(<Application/>, document.getElementById('main'));
});
