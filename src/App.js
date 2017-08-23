import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './App.css';
import Image from './image';
import reducers from './redusers';

class App extends Component {
  render() {
    const store = createStore(reducers);
    return (
      <div className="App">
        <Provider store={store}>
          <Image />
        </Provider>
      </div>
    );
  }
}

export default App;
