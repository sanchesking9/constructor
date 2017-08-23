import React, { Component } from 'react';
import './style.css';

export default class Button extends Component {
  click = (event) => {
    event.preventDefault();
    this.props.onClick && this.props.onClick();
  };

  render() {
    const {type = 'round'} = this.props;
    return <button className={'button ' + type} onClick={this.click}>{this.props.children}</button>;
  }
}
