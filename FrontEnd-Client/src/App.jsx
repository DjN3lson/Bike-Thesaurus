import { Route, Routes, useLocation } from 'react-router-dom';

import Manage from './Manage.jsx';
import Searchbar from './Searchbar';
import Navbar from './Navbar';
import BicycleList from './BicycleList.jsx';
import Index from './index.jsx'

// import Configuration from '.Configuration.jsx;

import './css/App.css'

function App() {
  const location = useLocation();
  return (
    <>

      <div className="App">
        <header className="App-header">
          <div className='UserContainerName'>
            {location.pathname !== '/' && <Navbar />}
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Searchbar />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/bicycles" element={<BicycleList />} />
          {/* Route path="/configuration" element={<Configuration />} />*/}
        </Routes>
      </div>
    </>
  )
}

export default App
