import React, {Component} from 'react';
import ControlContainer from './ControlsContainer';
import {connect} from 'react-redux';
import {setConfig, setFrame} from '../actions/image';
import {clipByName, debounce} from '../Utils';
import RotatePreview from './RotatePreview';
import UndoRedo from './UndoRedo';
import styled from 'styled-components';
import './scss/Image.css';
const fabric = require('fabric');

const Title = styled.h1`
  text-align: center;
  margin-bottom: 10px;
`

const CanvasContainer = styled.div`
  flex: 0 1 auto;
  width: 300px;
  border: 5px solid #004C70;
  padding: 80px;
  border-radius: 50%;
  position: relative;
  margin: 60px;
`

class Image extends Component {
  state = {
    color: '#fff',
    config: {},
    loaded: false,
  };

  canvasObj = {};

  saveState = false;

  componentDidMount() {
    this.initFabric();
    this.getConfigs();
  }

  isSaveState() {
    this.saveState = true;
  }

  getConfigs() {
    fetch('/image_builder_config.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          config: data,
          loaded: true,
        });
        this.props.setConfig(data);
        this.addBackground();
        this.addFrame();
      })
      .then(() => {
        const objectHandler = debounce(() => {
          if (this.saveState) {
            this.saveState = false;
            return;
          }
          this.UndoRedo.addState()
        }, 300);

        this.canvasObj.on('object:added', objectHandler);

        this.canvasObj.on('object:modified', objectHandler);
      })
  }

  addBackground = (img) => {
    const fjs = fabric.fabric;
    const imgUrl = img || this.state.config.background;
    const canvas = this.canvasObj;

    fjs.Image.fromURL(imgUrl, function (oImg) {
      oImg.setWidth(canvas.width);
      oImg.setHeight(canvas.height);
      canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0
      });
    });
  };

  addFrame() {
    const fjs = fabric.fabric;
    const canvas = this.canvasObj;
    const frame = this.state.config.frame;
    const defaultConfig = {
      width: 100,
      height: 100,
      fill: 'rgba(0, 0, 0, 0)',
      selectable: false,
      stroke: 'rgba(0,255,0,1)',
      strokeWidth: 1,
      evented: false,
      left: 0,
      top: 0
    };
    const outFrame = new fjs.Rect(frame ? Object.assign(defaultConfig, frame) : defaultConfig);

    // Use these properties for clipTo method in all Objects(Circle, Square, etc.) otherwise they will be undefined.
    fjs.Object.prototype._clipByName = clipByName;
    fjs.Object.prototype._frame = outFrame;
    canvas.add(outFrame);
    this.props.setFrame(outFrame);
  }

  initFabric() {
    const fjs = fabric.fabric;
    this.canvasObj = new fjs.Canvas('canvas', {stateful: true});
  }

  render() {
    const {config, loaded} = this.state;
    return (
      <div className="image">
        <Title>{config.title}</Title>
        <div className="wrapper">
          <CanvasContainer>
            <canvas id="canvas" width="300" height="300"></canvas>
            <ControlContainer config={config} fabric={fabric.fabric} canvas={this.canvasObj}/>
          </CanvasContainer>
          {loaded &&
            <div>
              <RotatePreview
                config={config}
                addFrame={this.addFrame.bind(this)}
                addBackground={this.addBackground.bind(this)}
                canvas={this.canvasObj}
                isSaveState={this.isSaveState.bind(this)}
              />
              <UndoRedo
                config={config}
                maxStateLength={config.maxStateLength}
                currentSide={this.props.currentSide}
                canvas={this.canvasObj}
                ref= {(UndoRedo) => this.UndoRedo = UndoRedo}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}


export default connect((state) => {
  const {image, currentSide} = state;
  return {image, currentSide};
}, {setConfig, setFrame})(Image);
