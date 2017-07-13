require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let images = require('../data/images');
(function(){
  for(var i=0;i<images.length;i++){
    images[i].path = require("../images/"+images[i].fileName);
  }
})();

class ImageFigure extends React.Component {

  render () {
    return (
        <figure className="img-figure">
          <img src={this.props.image.path} alt={this.props.image.title} />
          <figcaption>
            <h2 className="img-title">{this.props.image.title}</h2>
          </figcaption>
        </figure>
    );
  }
}

class AppComponent extends React.Component {

  render() {
    const controllerUnits = [];
    return (
      <div className="index">
        <section className="img-stage">
          <section className="img-sec">
            {
              images.map(function(item, key) {
                return (
                    <ImageFigure image={item} key={key} />
                );
              })
            }
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
