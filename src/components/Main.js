require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 加载图片数据
let images = require('../data/images.json');
(function(){
  for(var i=0;i<images.length;i++){
    images[i].path = require('../images/'+images[i].fileName);
  }
})();

// 单张图片组件
class ImageFigure extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.styleData.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
  }

  render () {
    let styleObj = {};
    if (this.props.styleData.pos) {
      styleObj = this.props.styleData.pos;
    }
    if (this.props.styleData.rotate) {
      ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].map((value)=>{
        styleObj[value] = 'rotate('+this.props.styleData.rotate+'deg)';
      });
    }
    if (this.props.styleData.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.styleData.isInverse?' is-inverse':'';

    return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
          <img src={this.props.image.path} alt={this.props.image.title} />
          <figcaption>
            <h2 className="img-title">{this.props.image.title}</h2>
            <div className="img-back" onClick={this.handleClick.bind(this)}>
              <p>
                {this.props.image.desc}
              </p>
            </div>
          </figcaption>
        </figure>
    );
  }
}

// 图片廊整体组件
class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /* {
             pos: {
               left: '0',
               top: '0'
              }
              rotate: 0，
              isInverse: 0
            }
         */
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
    return Math.ceil(Math.random()*(high-low)+low); // 向上取整
  }

  /*
   * 获取-30-30度范围的旋转角度
   */
  getRotationDegree() {
    return (Math.random()>0.5? '':'-')+Math.ceil(Math.random()*30);
  }

  /*
   * 通过闭包绑定翻转样式
   * @param index
   */
  imgInverse(index) {
    return(() => {
      let imgsArr = this.state.imgsArrangeArr;
      imgsArr[index].isInverse = !imgsArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArr
      });
    });
  }

  /*
   * 通过闭包实现点击其他图片居中效果
   * @param index
   */
  imgCenter(index) {
    return(()=>{
      this.rearrange(index);
    })
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
        leftImgsNum = this.getRandomRange(5, 7),
        rightImgsNum = imgsArrange.length-topImgsNum-leftImgsNum-1;

        // 设置中部图片位置信息
        centerImgArr = imgsArrange.splice(centerIndex, 1);
        centerImgArr[0] = {
          pos: centerPartPos,
          rotate: 0,
          isCenter: true
        };

        // 设置上部图片位置信息
        let topImgIndex = Math.ceil(Math.random()*(imgsArrange.length-topImgsNum));

        topImgsArr = imgsArrange.splice(topImgIndex, topImgsNum);
        topImgsArr.forEach((item, index) => {
          topImgsArr[index] = {
            pos : {
              top: this.getRandomRange(topPosRange.yRange[0], topPosRange.yRange[1]),
              left: this.getRandomRange(topPosRange.xRange[0], topPosRange.xRange[1])
            },
            rotate: this.getRotationDegree(),
            isCenter: false
          }

        });

        // 设置左部图片位置信息
        for(let i=0;i<leftImgsNum;i++){
          let tempIndex = this.getRandomRange(0, imgsArrange.length-1);
          imgsArrange[tempIndex] = {
            pos : {
              top: this.getRandomRange(leftPosRange.yRange[0], leftPosRange.yRange[1]),
              left: this.getRandomRange(leftPosRange.xRange[0], leftPosRange.xRange[1])
            },
            rotate: this.getRotationDegree(),
            isCenter: false
          };
          leftImgsArr.push(imgsArrange.splice(tempIndex, 1)[0]);
        }

        // 设置右部图片位置信息
        for(let j=0;j<rightImgsNum;j++){
          let tempIndex = this.getRandomRange(0, imgsArrange.length-1);
          imgsArrange[tempIndex] = {
            pos: {
              top: this.getRandomRange(rightPosRange.yRange[0], rightPosRange.yRange[1]),
              left: this.getRandomRange(rightPosRange.xRange[0], rightPosRange.xRange[1])
            },
            rotate: this.getRotationDegree(),
            isCenter: false
          };
          rightImgsArr.push(imgsArrange.splice(tempIndex, 1)[0]);
        }
        // 重新组合图片信息数组
        // imgsArrange.push.apply(imgsArrange, centerImgArr);
        imgsArrange.push.apply(imgsArrange, topImgsArr);
        imgsArrange.push.apply(imgsArrange, leftImgsArr);
        imgsArrange.push.apply(imgsArrange, rightImgsArr);
        // 打乱数组顺序
        imgsArrange.sort(function() {
          return Math.random()>0.5?-1:1;
        });
        imgsArrange.splice(centerIndex, 0, centerImgArr[0]);
        this.setState({
          imgsArrangeArr: imgsArrange
        });
  }

  componentDidMount() {
    // 获取图片大小，初始化常量对象
    // 图片大小统一为240*240
    /*
     * scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大
     * clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变
     * offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变
     */
    let stageNode = ReactDOM.findDOMNode(this.refs.stage),
        figureNode = ReactDOM.findDOMNode(this.refs.imgFigure0),
        stageW = stageNode.scrollWidth,
        stageH = stageNode.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2),
        figureW = figureNode.scrollWidth,
        figureH = figureNode.scrollHeight,
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
      yRange: [-halfFigureH, halfStageH-halfFigureH*3]
    };

    // 默认指定第一张图片居中
    this.rearrange(0);
  }

  render() {
    const controllerUnits = [];
    return (
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
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                  }
                }
                return (
                    <ImageFigure image={item} ref={'imgFigure'+index} key={index} styleData={this.state.imgsArrangeArr[index]} inverse={this.imgInverse(index)} center={this.imgCenter(index)} />
                );
              })
            }
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
