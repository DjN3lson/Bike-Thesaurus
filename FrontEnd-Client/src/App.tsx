import { Route, Routes } from 'react-router-dom';

import Manage from './Manage';
import SignIn from './Signin';
import Searchbar from './Searchbar';
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
            {/* <Route path="/logout" Component={Logout} /> */}
          </Routes>
        
      </div>
    </>
  )
}

export default App
