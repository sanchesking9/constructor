import React, {Component} from 'react';

export default class UndoRedo extends Component {
  constructor(props) {
    super(props);

    const state = {};

    for (let i = 0; i < props.config.sidesBackground.length; i += 1) {
      state[props.config.sidesBackground[i].side] = {
        index: 0,
        states: []
      };
    }

    this.state = state;
  }

  saveState = true;

  addState() {
    if (!this.saveState) {
      this.saveState = true;
      return;
    }

    const {maxStateLength, currentSide, canvas} = this.props;
    const savedState = canvas.toJSON(['selectable', 'evented']);
    const {states, index} = this.state[currentSide]
    let resultState = [];

    if (states.length > maxStateLength) {
      resultState = states.slice(1);
    } else {
      resultState = states.slice(0, index + 1)
    }

    resultState.push(savedState);

    this.setState({
      [currentSide]: {
        states: resultState,
        index: resultState.length - 1,
      },
    })
  }

  undo() {
    const {currentSide, canvas} = this.props;
    const {states, index} = this.state[currentSide];

    if (!index || !states.length) return; // if have no undoState

    this.saveState = false;

    canvas.loadFromJSON(states[this.undoIndex()]);
  }

  redo() {
    const {maxStateLength, currentSide, canvas} = this.props;
    const {states, index} = this.state[currentSide];


    if (index >= maxStateLength || index + 1 >= states.length) return; // if have no redoState

    this.saveState = false;

    canvas.loadFromJSON(states[this.redoIndex()]);
  }

  undoIndex() {
    const {currentSide} = this.props;
    const {index} = this.state[currentSide];
    const newIndex = index === 0 ? index : index - 1;

    this.setState((prevState) => {
      const newState = prevState;
      newState[currentSide].index = newIndex;
      return newState;
    })

    return newIndex;
  }

  redoIndex() {
    const {maxStateLength, currentSide} = this.props;
    const {index} = this.state[currentSide];
    const newIndex = index >= maxStateLength ? index : index + 1;

    this.setState((prevState) => {
      const newState = prevState;
      newState[currentSide].index = newIndex;
      return newState;
    })

    return newIndex;
  }

  render() {
    return (
      <div>
        <button onClick={this.undo.bind(this)}>Undo</button>
        <button onClick={this.redo.bind(this)}>Redo</button>
      </div>
    )
  }
}
