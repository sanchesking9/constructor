import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';

class ChangeColorForSelected extends Component {
  changeColorForSelected = () => {
    const canvas = this.props.canvas;
    if(canvas.getActiveGroup()){
      canvas.getActiveGroup().forEachObject((o) => o.set('fill', this.props.image.color));
      canvas.discardActiveGroup().renderAll();
      canvas.trigger('object:modified');
    } else if (canvas.getActiveObject()) {
      canvas.getActiveObject().set('fill', this.props.image.color);
      canvas.trigger('object:modified');
      canvas.renderAll();
    }
  };

  render() {
    return (<div>
      <Button onClick={this.changeColorForSelected}>Change Color For Selected</Button>
    </div>);
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(ChangeColorForSelected);
