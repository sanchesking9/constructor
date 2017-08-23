import React, {Component} from 'react';
import {connect} from 'react-redux';

class RotatePreview extends Component {
  state = {
    currentSide: 'front',
  };

  changeSide(e) {
    const {config, canvas, addFrame, addBackground} = this.props;
    const {currentSide} = this.state;
    const side = e.currentTarget.dataset.side;
    const imgUrl = config.sidesBackground.find(item => item.side === side).background;

    if (side !== currentSide) {
      this.setState({
        [currentSide]: [...canvas.getObjects()],
        currentSide: side,
        currentImg: imgUrl,
      });

      canvas.clear();

      if (this.state[side] && this.state[side].length) {
        addBackground(imgUrl);
        for (let i = 0; i < this.state[side].length; i += 1) {
          canvas.add(this.state[side][i])
        }
      } else {
        addBackground(imgUrl);
        addFrame()
      }
    }
  }

  download() {
    const {image: {frame}, canvas, addBackground} = this.props;

    frame.set({
      opacity: 0,
    })

    if (this.saveCheckbox.checked) {
      canvas.backgroundImage = null;
    }

    this.link.href = canvas.toDataURL({format: 'png'});

    if (this.saveCheckbox.checked) {
      addBackground(this.state.currentImg);
    }

    frame.set({
      opacity: 1,
    })

    canvas.renderAll();
  }

  render() {
    const {config} = this.props;
    return (
      <div className="rotate-preview">
        <ul>
          {config.sidesBackground && config.sidesBackground.length && config.sidesBackground.map((item, index) => {
            return (
              <li key={index}>
                <div className="title">{item.side}</div>
                <img
                  className={item.side === this.state.currentSide && 'selected'}
                  data-side={item.side}
                  onClick={this.changeSide.bind(this)}
                  src={item.background}
                />
              </li>
            )
          })}
        </ul>
        <div>
          <a
            className="download-link"
            ref={link => this.link = link}
            href='#' onClick={this.download.bind(this)}
            download='test.png'>
            Save
          </a>
          <label className="download-checkbox">
            Save without background
            <input ref={saveCheckbox => this.saveCheckbox = saveCheckbox} type="checkbox"/>
          </label>
        </div>
        <div>
          <button onClick={this.props.undo}>Undo</button>
          <button onClick={this.props.redo}>Redo</button>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  const {image} = state;
  return {image};
})(RotatePreview);
