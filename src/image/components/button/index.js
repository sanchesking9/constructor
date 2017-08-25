import React, { Component } from 'react';
import styled from 'styled-components'

const buttonBackground = '#0093D1';
const buttonTextColor = '#004C70';

const hoverButton = () => `
  background: ${buttonBackground};
  color: #fff;
`

const ControlButton = styled.div`
  box-sizing: border-box;
  background: #fff; 
  color: ${buttonTextColor};
  text-align: center;
  border: 2px solid ${buttonBackground};
  outline: none;
  transition: background .4s ease, color .4s ease;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &.round {
      height: 100px;
      width: 100px;
      border-radius: 50%;
  }
 
  &:hover {
    ${hoverButton()}
  }
`;

export default class Button extends Component {
  click = (event) => {
    event.preventDefault();
    this.props.onClick && this.props.onClick();
  };

  static hover() {
    return hoverButton()
  }

  render() {
    const {type = 'round'} = this.props;
    return (
        <ControlButton className={`${type} control-button ${this.props.className ? this.props.className : ''}`} onClick={this.click}>{this.props.children}</ControlButton>
    )
  }
}
