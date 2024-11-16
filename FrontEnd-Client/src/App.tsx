import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Manage from './Manage';
import Register from './Register';
import Searchbar from './Searchbar';
import Navbar from './Navbar';
import './css/App.css'
import Login from './LogIn';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setFirstName(name)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setFirstName(null);
  }

  return (
    <>

      <div className="App">
        <header className="App-header">
          <div className='UserContainerName'>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} firstName={firstName} />
          </div>
        </header>
        <Routes>
        <Route path="/" element={<Searchbar />} />
          <Route path="manage" element={<Manage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/logout" />
        </Routes>
      </div>
    </>
  )
}

export default App
