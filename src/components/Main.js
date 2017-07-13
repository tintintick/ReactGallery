require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

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

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: '0',
        //     top: '0'
        //   }
        // }
      ]
    };
  }

  Constent = {
    centerPartPos: {
      left: 0,
      top: 0
    },
    leftPosRange: {
      xRange: [0, 0],
      yRange: [0, 0]
    },
    rightPosRange: {
      xRange: [0, 0],
      yRange: [0, 0]
    },
    topPosRange: {
      xRange: [0, 0],
      yRange: [0, 0]
    }
  };

  /*
   * 重新排布图片
   * @param centerIndex 需要居中图片的ref值
   */
  rearrange(centerIndex) {

  }

  componentDidMount() {
    // 获取图片大小，初始化常量对象
    let stageNode = ReactDOM.findDOMNode(this.refs.stage),
        figureNode = ReactDOM.findDOMNode(this.refs.imgFigure0),
        stageW = stageNode.scollWidth,
        stageH = stageNode.scollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2),
        figureW = figureNode.scollWidth,
        figureH = figureNode.scollHeight,
        halfFigureW = Math.ceil(figureW / 2),
        halfFigureH = Math.ceil(figureH / 2);

    // 中间图片坐标
    this.Constent.centerPartPos = {
      left: halfStageW-halfFigureW,
      top: halfStageH-halfFigureH
    };
    // 左部图片坐标取值范围
    this.Constent.leftPosRange = {
      xRange: [-halfFigureW, halfStageW-halfFigureW*3],
      yRange: [-halfFigureH, stageH-halfFigureH]
    };
    // 右部图片坐标取值范围
    this.Constent.rightPosRange = {
      xRange: [halfStageW+halfFigureW, stageW-halfFigureW],
      yRange: [-halfFigureH, stageH-halfFigureH]
    };
    // 上部图片坐标取值范围
    this.Constent.topPosRange = {
      xRange: [halfStageW-figureW, halfStageW],
      yRange: [halfStageH+halfFigureH, stageH-halfFigureH]
    };

    // 默认指定第一张图片居中
    this.rearrange(0);
  }

  render() {
    const controllerUnits = [];
    return (
      <div className="index">
        <section className="img-stage" ref="stage">
          <section className="img-sec">
            {
              images.map((item, index) => {
                // 为每张图片初始化state
                if(!this.state.imgsArrangeArr[index]) {
                  this.state.imgsArrangeArr[index] = {
                    pos: {
                      left: '0',
                      top: '0'
                    }
                  }
                }
                return (
                    <ImageFigure image={item} ref={'imgFigure'+index} key={index} />
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
