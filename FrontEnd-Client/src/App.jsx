import { Route, Routes } from 'react-router-dom';

import Manage from './Manage.jsx';

import Searchbar from './Searchbar';
import Navbar from './Navbar';
import './css/App.css'
import BicycleList from './BicycleList.jsx';

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
          <Route path="/bicycles" element={<BicycleList />} />
        </Routes>
      </div>
    </>
  )
}

export default App
