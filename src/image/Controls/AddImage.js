import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';
import styled from 'styled-components'

const FileInput = styled.input.attrs({
  type: 'file'
})`
  position: absolute;
  width: 100px;
  height: 100px;
  opacity: 0;
  left: 0;
  
  &:hover + .file-btn {
    ${Button.hover()}
  }
`

class AddImage extends Component {
  _handleImageChange(event) {
    event.preventDefault();

    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = () => {
      this.addImage(reader.result);
    };

    reader.readAsDataURL(file);
    this.file.value = null;
  }

  addImage = (dataURL) => {
    const fjs = this.props.fabric;
    const {left = 80, top = 80} = this.props.image.frame;
    const img = document.createElement("IMG");
    img.onload = () => {
      const fImg = new fjs.Image(img, {
        top : top,
        left : left,
        scaleX: 0.2,
        scaleY: 0.2,
        clipTo: function(ctx) {
          return this._clipByName(ctx, this._frame);
        }
      });
      this.props.canvas.add(fImg);
    };
    img.src = dataURL;
  };

  render() {
    return (
      <div className="add-image">
        <FileInput ref={(file) => this.file = file} onChange={(event)=>this._handleImageChange(event)} />
        <Button className="file-btn">
          Add image
        </Button>
      </div>
    );
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddImage);
