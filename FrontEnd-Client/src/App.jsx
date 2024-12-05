import { Route, Routes } from 'react-router-dom';

import Manage from './Manage.jsx';

import Searchbar from './Searchbar';
import Navbar from './Navbar';
import './css/App.css'

function App() {

  return (
    <>

      <div className="App">
        <header className="App-header">
          <div className='UserContainerName'>
            <Navbar />
          </div>
        </header>
        <Routes>
        <Route path="/" element={<Searchbar />} />
          <Route path="manage" element={<Manage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
