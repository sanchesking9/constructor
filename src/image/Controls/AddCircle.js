import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';

class AddCircle extends Component {
  addCircle = () => {
    let {frame = {}} = this.props.image;
    const {left = 80, top = 80} = frame;
    const rad = 20;


    const fjs = this.props.fabric;

    const circle = new fjs.Circle({
      radius: rad,
      left: left + rad,
      top: top + rad,
      hasBorders: false,
      originX: 'center',
      originY: 'center',
      fill: this.props.image.color,
      clipTo: function (ctx) {
          return this._clipByName(ctx, this._frame);
      }
    });
    this.props.canvas.add(circle);
  };

  render() {
    return <Button onClick={this.addCircle.bind(this)}>Add circle</Button>
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddCircle);
