import { useState, useEffect } from 'react';
import axios from 'axios';
import HallPass from './components/HallPass';
import "./App.css"
import { Link } from 'react-router-dom';
import { getBackendURL } from './utilities';
import Login from './components/Login';

function App() {
  const [passes, setPasses] = useState([]);
  const [filteredDestination, setFilteredDestination] = useState("All")
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('loggedIn') == 'true') {
      const ONE_HOUR = 3600000; 
      const loginDate = parseInt(localStorage.getItem('loginDate'));
      const timeSinceLogin = Date.now() - loginDate;
      if (timeSinceLogin < ONE_HOUR) {
        setLoggedIn(true)
      }
    }
  })

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        let response = ""
        if (filteredDestination === "All") {
          response = await axios.get(`http://${getBackendURL()}/api/getPasses?now=${Date.now()}`);
        } else {
          response = await axios.get(`http://${getBackendURL()}/api/filterPasses?destination=${filteredDestination}&now=${Date.now()}`);
        }
        setPasses(response.data.responses);
      } catch (error) {
        console.error('Error fetching passes:', error);
      }
    };

    fetchPasses();

    const interval = setInterval(fetchPasses, 30000);
    return () => clearInterval(interval);
  }, [filteredDestination]);

  return (
    <>
      {loggedIn ? (<>
        <nav class="navbar">
          <div class="logo">Crockett Pass Dashboard</div>
          <div className="flex items-center gap-4">
            <Link to='/'>
              <button className="px-4 py-2 ">
                Current Passes
              </button>
            </Link>
            <Link to='/lookup'>
              <button className="px-4 py-2 ">
                Student Lookup
              </button>
            </Link>
            <Link to='/settings'>
              <button className="px-4 py-2 ">
                Settings
              </button>
            </Link>
          </div>
        </nav>
        <div class="dropdownA">
          <button class="dropbtn">{filteredDestination} ▼</button>
          <div class="dropdown-contentA">
            <p onClick={() => setFilteredDestination("All")}>All</p>
            <p onClick={() => setFilteredDestination("Lavatory")}>Lavatory</p>
            <p onClick={() => setFilteredDestination("Main Office")}>Main Office</p>
            <p onClick={() => setFilteredDestination("A-House Office")}>A-House Office</p>
            <p onClick={() => setFilteredDestination("B-House Office")}>B-House Office</p>
            <p onClick={() => setFilteredDestination("Media Center")}>Media Center</p>
            <p onClick={() => setFilteredDestination("Nurse")}>Nurse</p>
            <p onClick={() => setFilteredDestination("Water")}>Water</p>
          </div>
        </div>
        <div className="dashboard">

          {passes.map((pass, index) => (
            <div
              key={`${pass.id}-${pass.timeOut.seconds}`}
              className="pass-container"
              style={{
                marginTop: `${(index % 2) * 20}px`
              }}
            >
              <HallPass
                studentName={pass.studentName}
                studentEmail={pass.email}
                location={pass.destination}
                timeOut={pass.timeOut.seconds * 1000}
                timeIn={pass.timeIn.seconds * 1000}
              />
            </div>
          ))}
        </div>
      </>
      ) : (
        <Login setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;