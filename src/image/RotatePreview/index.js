import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setSide} from '../../actions/currentSide';
import styled from 'styled-components';
import {ControlButton} from '../components/button';

const Title = styled.div`
  text-transform: capitalize;
  font-size: 16px;
  margin-bottom: 4px;
`;

const Img = styled.img`
  cursor: pointer;
  width: 85px;
  height: 85px;
  border: 2px solid transparent;
  transition: all .3s;

  &:hover {
      border-color: #dcdcdc;
  }
  
  &.selected {
      border-color: #0093D1;
  }
`

let DownloadLink = ControlButton.withComponent('a');
DownloadLink = styled(DownloadLink)`
  text-decoration: none;
`

const Checkbox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid #0093D1;
  margin-left: 5px;
  
  
  &::after {
      content: '';
      width: 10px;
      margin-bottom: 4px;
      height: 6px;
      border-left: 2px solid #0093D1;
      border-bottom: 2px solid #0093D1;
      transform: rotate(-45deg);
      display: none;
  }
`

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

    console.log(this.link);

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
                <Title>{item.side}</Title>
                <Img
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
          <DownloadLink
            className="download-link"
            innerRef={link => this.link = link}
            href=''
            onClick={this.download.bind(this)}
            download='test.png'
          >
            Save
          </DownloadLink>
          <input ref={saveCheckbox => this.saveCheckbox = saveCheckbox} type="checkbox" id="checkbox" defaultChecked={false}/>
          <label htmlFor="checkbox" className="download-checkbox">
            Save without background
            <Checkbox/>
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
