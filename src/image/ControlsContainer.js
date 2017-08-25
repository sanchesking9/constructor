import React, { Component } from 'react';
import * as Controls from './Controls';
import styled from 'styled-components';

const circleContainer = `
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  left: -40px;
  top: -40px;
  pointer-events: none;
  
  & > .control {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    pointer-events: auto;
    margin: -2em;
  }
`;

const ControlsContainerDiv = styled.div`
  position: absolute;
  width: 370px;
  top: 0;
  right: -310px;
  color: #fff;
  
  & > .control {
      border-radius: 50%;
      margin-bottom: 10px;
      display: inline-block;
      margin-right: 5px;
  }
  ${(props) => props.circle && circleContainer}
`

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
      return <div className={`control ${component}`} key={index} style={positions[index]}><Component fabric={fabric} canvas={canvas} /></div>;
    });
    return (
      <ControlsContainerDiv circle>
        {controls}
      </ControlsContainerDiv>
    );
  }
}
