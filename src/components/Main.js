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
    let styleObj = {};
    if (this.props.styleData.pos){
      styleObj = this.props.styleData.pos;
    }

    return (
        <figure className="img-figure" style={styleObj}>
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
   * 在取值范围内生成随机数
   * @param low最小值，high最大值
   */
  getRandomRange(low, high) {
    return Math.ceil(Math.random()*(high-low)+low);
  }

  /*
   * 重新排布图片
   * @param centerIndex 需要居中图片的ref值
   */
  rearrange(centerIndex) {
    let imgsArrange = this.state.imgsArrangeArr,
        Constent = this.Constent,
        centerPartPos = Constent.centerPartPos,
        leftPosRange = Constent.leftPosRange,
        rightPosRange = Constent.rightPosRange,
        topPosRange = Constent.topPosRange,
        centerImgArr = [],
        leftImgsArr = [],
        rightImgsArr = [],
        topImgsArr = [],
        topImgsNum = this.getRandomRange(0, 1),
        leftImgsNum = this.getRandomRange(3, 5),
        rightImgsNum = imgsArrange.length-topImgsNum-leftImgsNum-1;

        centerImgArr = imgsArrange.splice(centerIndex, 1);
        // 设置中部图片位置信息
        centerImgArr[0].pos = centerPartPos;
        // 设置上部图片位置信息
        let topImgIndex = Math.ceil(Math.random()*(imgsArrange.length-topImgsNum));
        topImgsArr = imgsArrange.splice(topImgIndex, topImgsNum);
        topImgsArr.forEach((item, index) => {
          topImgsArr[index].pos = {
            top: this.getRandomRange(topPosRange.yRange[0], topPosRange.yRange[1]),
            left: this.getRandomRange(topPosRange.xRange[0], topPosRange.xRange[1])
          }
        });
        // 设置左部图片位置信息
        for(let i=0;i<leftImgsNum;i++){
          let tempIndex = this.getRandomRange(0, imgsArrange.length);
          imgsArrange[tempIndex].pos = {
            top: this.getRandomRange(leftPosRange.yRange[0], leftPosRange.yRange[1]),
            left: this.getRandomRange(leftPosRange.xRange[0], leftPosRange.xRange[1])
          };
          leftImgsArr.push(imgsArrange.splice(tempIndex, 1)[0]);
        }
        // 设置右部图片位置信息
        for(let i=0;i<rightImgsNum;i++){
          let tempIndex = this.getRandomRange(0, imgsArrange.length);
          imgsArrange[tempIndex].pos = {
            top: this.getRandomRange(rightPosRange.yRange[0], rightPosRange.yRange[1]),
            left: this.getRandomRange(rightPosRange.xRange[0], rightPosRange.xRange[1])
          };
          rightImgsArr.push(imgsArrange.splice(tempIndex, 1)[0]);
        }

        // 重新组合图片信息数组
        imgsArrange.push.apply(imgsArrange, centerImgArr);
        imgsArrange.push.apply(imgsArrange, topImgsArr);
        imgsArrange.push.apply(imgsArrange, leftImgsArr);
        imgsArrange.push.apply(imgsArrange, rightImgsArr);

        this.setState({
          imgsArrangeArr: imgsArrange
        });
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
                    <ImageFigure image={item} ref={'imgFigure'+index} key={index} styleData={this.state.imgsArrangeArr[index]} />
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
