import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Manage from './Manage';
import SignIn from './Signin';
import Searchbar from './Searchbar';
import Navbar from './Navbar';
import './css/App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setUserName] = useState<string | null>(null);

  const handleLogin = () =>{
    setIsLoggedIn(true);
    setUserName(firstName)
  }

  const handleLogout= () =>{
    setIsLoggedIn(false)
    setUserName(null);
  }

  return (
    <>
    
      <div className="App">
        <header className="App-header">
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} firstName={firstName} />
        </header>
          <Routes>
            <Route path="/" Component={Searchbar} />
            <Route path="manage" Component={Manage} />
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />}/>
            <Route path="/logout" />
          </Routes>
      </div>
    </>
  )
}

export default App
