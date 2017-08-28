import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';

class AddText extends Component {
  addText = () => {
    const {frame = {}} = this.props.image;
    const {left = 80, top = 80} = frame;
    const fjs = this.props.fabric;
    const inputText = 'Edit text';
    const text = new fjs.IText(inputText, {
      left: left, //Take the block's position
      top: top,
      fill: this.props.image.color ? this.props.image.color : 'white',
      clipTo: function(ctx) {
        return this._clipByName(ctx, this._frame);
      }
    });
    this.props.canvas.add(text).setActiveObject(text);
    text.selectAll();
    text.enterEditing();
  };

  render() {
    return <Button onClick={this.addText}>Add text</Button>
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddText);
