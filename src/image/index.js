import React, {Component} from 'react';
import ControlContainer from './ControlsContainer';
import {connect} from 'react-redux';
import {setConfig, setFrame} from '../actions/image';
import {clipByName, debounce} from '../Utils';
import RotatePreview from './RotatePreview/RotatePreview';
import './css/Image.css';
var fabric = require('fabric');

class Image extends Component {
  state = {
    color: '#fff',
    config: {},
    undoRedo: {
      currentIndex: 0,
      maxStateLength: 5,
      states: [],
    }
  };

  canvasObj = {};

  progress = true;

  componentDidMount() {
    this.initFabric();
    this.getConfigs();
  }

  getConfigs() {
    fetch('/image_builder_config.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          config: data,
        });
        this.props.setConfig({config: data});
        this.addBackground();
        this.addFrame();
      })
      .then(() => {
        const objectHandler = debounce(() => {
          if (this.progress) {
            this.addUndoRedoState(this.canvasObj.toJSON());
          } else {
            this.progress = true;
          }
        }, 300);
        this.canvasObj.on('object:added', objectHandler);

        this.canvasObj.on('object:modified', objectHandler);
      })
  }

  addUndoRedoState(state) {
    let {states, currentIndex, maxStateLength} = this.state.undoRedo
    let resultState = [];

    if (states.length >= maxStateLength) {
      resultState = states.slice(1);
    } else {
      resultState = states.slice(0, currentIndex + 1)
    }

    resultState.push(state);

    this.setState({
      undoRedo: {
        states: [...resultState],
        currentIndex: resultState.length - 1
      }
    })
  }

  undo() {
    const {states, currentIndex} = this.state.undoRedo;

    if (!currentIndex || !states.length) return; // if have no undoState

    this.progress = false;

    this.canvasObj.loadFromJSON(states[this.undoIndex()]);
  }

  redo() {
    const {states, currentIndex, maxStateLength} = this.state.undoRedo;

    if (currentIndex >= maxStateLength) return;

    this.progress = false;

    this.canvasObj.loadFromJSON(states[this.redoIndex()]);
  }

  undoIndex() {
    const {undoRedo, undoRedo: {currentIndex}} = this.state;
    const newIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;

    this.setState({
      undoRedo: Object.assign(undoRedo, {currentIndex: newIndex})
    })

    return newIndex;
  }

  redoIndex() {
    const {undoRedo, undoRedo: {currentIndex, maxStateLength}} = this.state;
    const newIndex = currentIndex >= maxStateLength ? currentIndex : currentIndex + 1;

    this.setState({
      undoRedo: Object.assign(undoRedo, {currentIndex: newIndex})
    })

    return newIndex;
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
    const canvas = this.canvasObj = new fjs.Canvas('canvas', {stateful: true});
  }

  render() {
    const {config} = this.state;
    return (<div className="image">
      <h1>{config.title}</h1>
      <div className="wrapper">
        <div className="image-canvas-container">
          <canvas id="canvas" width="300" height="300"></canvas>
          <ControlContainer config={config} fabric={fabric.fabric} canvas={this.canvasObj}/>
        </div>
        <RotatePreview
          config={config}
          addFrame={this.addFrame.bind(this)}
          addBackground={this.addBackground.bind(this)}
          canvas={this.canvasObj}
          undo={this.undo.bind(this)}
          redo={this.redo.bind(this)}
        />
      </div>

    </div>);
  }
}


export default connect((state) => {
  const {image} = state;
  return {image};
}, {setConfig, setFrame})(Image);
