import React, { Component } from 'react';
import {setColor} from '../../actions/image';
import { SketchPicker } from 'react-color';
import { connect } from 'react-redux';
import Button from '../components/button';
import ClickOutside from 'react-click-outside';
import styled from 'styled-components'

const ColorPickerButton = styled.div`
  width: 25px;
  height: 25px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  border: 1px solid #0093D1;
  background: ${props => props.bg || '#fff'};

  .color-picker:hover & {
      border-color: white;
  }
`

const PickerColor = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
`

class ColorPicker extends Component {
  state = {
    color: '#fff'
  };

  handleChangeColor = (color) => {
    this.props.setColor(color.hex);
  };

  hide = () => this.setState({colorPickerOpened: false});

  render() {
    const bg = this.props.image.color;
    return (
      <Button className="color-picker">
        <span>Color: </span>
        <ColorPickerButton bg={bg} onClick={() => {!this.state.colorPickerOpened && this.setState({colorPickerOpened: true})}}>
          {this.state.colorPickerOpened &&
          <ClickOutside onClickOutside={this.hide.bind(this)}>
            <PickerColor>
              <SketchPicker color={ this.state.color } onChangeComplete={ this.handleChangeColor }/>
              <Button type="square" onClick={this.hide}>done</Button>
            </PickerColor>
          </ClickOutside>
          }
        </ColorPickerButton>
      </Button>
    );
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
}, {setColor})(ColorPicker);
