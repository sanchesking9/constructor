import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/button';
import ClickOutside from 'react-click-outside';
import styled from 'styled-components'

const StickerPopup = styled.div`
  position: absolute;
  width: 210px;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #006495;
  
  img {
      width: 100px;
  }
`

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
        top: top,
        left: left,
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

  hide() {
    this.setState({ showPopup: false })
  }

  render() {
    const {config} = this.props.image;
    console.log(config);
    return (
      <div className="AddSticker">
        <Button onClick={this.showSticker}>Add sticker</Button>
        {this.state.showPopup &&
          <ClickOutside onClickOutside={this.hide.bind(this)}>
            <StickerPopup>
              {config && config.stickers && config.stickers.map((item, index) => {
                return <div key={index} onClick={this.addImage.bind(this, item)}><img alt="img" src={item} /></div>
              })}
            </StickerPopup>
          </ClickOutside>
        }
      </div>
    );
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(AddSticker);
