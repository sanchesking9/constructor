import React, { Component } from 'react';
import Button from '../components/button';

export default class DeleteSelectedObjects extends Component {
  deleteSelectedObjects = () => {
    const canvas = this.props.canvas;
    if(canvas.getActiveGroup()){
      canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
      canvas.discardActiveGroup().renderAll();
    } else {
      canvas.remove(canvas.getActiveObject());
    }
  };

  render() {
    return <Button onClick={this.deleteSelectedObjects}>Remove selected objects</Button>
  }
}
