import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';
import ClickOutside from 'react-click-outside';
import './css/AddSticker.css';

class AddSticker extends Component {
  state = {
    showPopup: false
  };
  showSticker = () => {
    this.setState({showPopup: !this.state.showPopup})
  };

  addImage = (dataURL) => {
    const fjs = this.props.fabric;
    const {frame = {}} = this.props.image;
    const {left = 80, top = 80} = frame;
    const img = document.createElement("IMG");
    this.hide();
    img.onload = () => {
      const fImg = new fjs.Image(img, {
        top : top,
        left : left,
        scaleX: 0.5,
        scaleY: 0.5,
        clipTo: function(ctx) {
          return this._clipByName(ctx, this._frame);
        }
      });
      this.props.canvas.add(fImg);
    };
    img.src = dataURL;
  };

  render() {
    const {config} = this.props.image;
    return (<div className="AddSticker">
      <Button onClick={this.showSticker}>Add sticker</Button>
      {this.state.showPopup && <ClickOutside onClickOutside={this.hide.bind(this)}>
        <div className="sticker-popup">
          {config.config && config.config.stickers && config.config.stickers.map((item, index) => {
            return <div key={index} onClick={this.addImage.bind(this, item)}><img src={item} /></div>
          })}
        </div>
      </ClickOutside>}
    </div>);
  }

  hide() {
    this.setState({ showPopup: false })
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddSticker);
