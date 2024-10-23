import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios'

import Manage from './Manage';
import SignIn from './Signin';
import Navbar from './Navbar'
import Searchbar from './Searchbar'
import './css/App.css'

function App() {

  return (
    <>
      <div className="App">
        <header className="App-header"></header>
          <Routes>
            <Route path="/" Component={Searchbar} />
            <Route path="manage" Component={Manage} />
            <Route path="/signin" Component={SignIn} />
            <Route path="/logout" Component={Logout} />
          </Routes>
        
      </div>
    </>
  )
}

export default App
