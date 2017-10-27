import _css from 'bootstrap/less/bootstrap.less';

import React from 'react';
import ReactDOM from 'react-dom';


function Application({}) {
  return (
    <div className="container">
      <h1>The Button</h1>
    </div>
  );
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <Application/>,
    document.getElementById('main')
  );
});
