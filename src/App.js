import React from 'react';
import {Routes ,Route} from 'react-router-dom';
import './App.css';

import { Home } from './nav/home';

function App() {

  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </div>
  );
}

export default App;
