import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setSide} from '../../actions/currentSide';

class RotatePreview extends Component {
  state = {}

  changeSide(e) {
    const {config, canvas, setSide, addFrame, addBackground, currentSide, isSaveState} = this.props;
    const side = e.currentTarget.dataset.side;
    const imgUrl = config.sidesBackground.find(item => item.side === side).background;

    if (side !== currentSide) {
      isSaveState()
      this.setState({
        [currentSide]: canvas.toJSON(['selectable', 'evented']),
        currentImg: imgUrl,
      });

      setSide(side);

      canvas.clear();

      if (this.state[side]) {
        canvas.loadFromJSON(this.state[side], canvas.renderAll.bind(canvas));
      } else {
        addBackground(imgUrl);
        addFrame()
      }
    }
  }

  download() {
    const {image: {frame}, canvas, addBackground, addFrame, isSaveState} = this.props;

    isSaveState()
    canvas.remove(frame);

    if (this.saveCheckbox.checked) {
      canvas.backgroundImage = null;
    }

    this.link.href = canvas.toDataURL({format: 'png'});

    if (this.saveCheckbox.checked) {
      addBackground(this.state.currentImg);
    }

    addFrame();

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
                  className={item.side === this.props.currentSide && 'selected'}
                  data-side={item.side}
                  onClick={this.changeSide.bind(this)}
                  src={item.background}
                  alt="t-short"
                />
              </li>
            )
          })}
        </ul>
        <div>
          <a
            className="download-link"
            ref={link => this.link = link}
            href='' onClick={this.download.bind(this)}
            download='test.png'>
            Save
          </a>
          <label className="download-checkbox">
            Save without background
            <input ref={saveCheckbox => this.saveCheckbox = saveCheckbox} type="checkbox"/>
          </label>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  const {image, currentSide} = state;
  return {image, currentSide};
}, {setSide})(RotatePreview);
