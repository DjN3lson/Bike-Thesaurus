import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Manage from './Manage';
import SignIn from './Register';
import Searchbar from './Searchbar';
import Navbar from './Navbar';
import './css/App.css'
import Login from './LogIn';

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
          <div className='UserContainerName'>          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} firstName={firstName} />
</div>
        </header>
          <Routes>
            <Route path="/" Component={Searchbar} />
            <Route path="manage" Component={Manage} />
            <Route path="/register" element={<SignIn onLogin={handleLogin} />}/>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/logout" />
          </Routes>
      </div>
    </>
  )
}

export default App
