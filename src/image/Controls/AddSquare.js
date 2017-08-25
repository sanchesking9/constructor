import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';

class AddSquare extends Component {
  addSquare = () => {
    const fjs = this.props.fabric;
    const {frame = {}} = this.props.image;
    const {left = 80, top = 80} = frame;
    const rect = new fjs.Rect({
      top : top,
      left : left,
      width : 100,
      height : 100,
      fill : this.props.image.color,
      clipTo: function(ctx) {
        return this._clipByName(ctx, this._frame);
      }
    });
    this.props.canvas.add(rect);
  };

  render() {
    return <Button onClick={this.addSquare}>Add square</Button>
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddSquare);
