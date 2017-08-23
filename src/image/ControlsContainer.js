import React, { Component } from 'react';
import * as Controls from './Controls';

export default class ControlsContainer extends Component {
  defaultProps = {
    config: {
      controls: []
    }
  };

  getPositions(count) {
    const onePosition = 360 / count;
    const rad = 15;
    let styles = [];
    for (let i = 1; count >= i; i++) {
      let currentPosition = onePosition * i;
      styles.push({transform: `rotate(${currentPosition}deg) translate(${rad}em) rotate(-${currentPosition}deg)`})
    }
    return styles;
  }

  render() {
    const {config, fabric, canvas} = this.props;
    if (!config || !config.controls) {
      return <div>Loadig...</div>;
    }
    const positions = this.getPositions(config.controls.length);
    const controls = config.controls.map((component, index) => {
      const Component = Controls[component];
      return <div className="control" key={index} style={positions[index]}><Component fabric={fabric} canvas={canvas} /></div>;
    });
    return (<div className="controlsContainer circle-container">
      {controls.map((item) => item)}
    </div>);
  }
}
