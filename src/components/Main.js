require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let images = require('../data/images');

class AppComponent extends React.Component {
  render() {
    (function(){
      for(var i=0;i<images.length;i++){
        images[i].path = require("../images/"+images[i].fileName);
      }
    })();
    return (
      <div className="index">
        <section className="img-stage">
          <section className="img-sec">

          </section>
          <nav className="controller-nav">

          </nav>
        </section>
        {
          images.map(function(item, key) {
            return (
              <div key={key}>
                <figure>
                  <img src={item.path} />
                </figure>
                <figcaption>
                  {item.title}
                </figcaption>
              </div>
            )
          })
        }
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
