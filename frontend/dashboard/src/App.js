import { useState, useEffect } from 'react';
import axios from 'axios';
import HallPass from './components/HallPass';
import "./App.css"
import { Link } from 'react-router-dom';

function App() {
  const [passes, setPasses] = useState([]);
  const [filteredDestination, setFilteredDestination] = useState("All")

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = ""
        if (filteredDestination == "All") {
          response = await axios.get('http://localhost:5001/api/getPasses');
        } else {
          response = await axios.get(`http://localhost:5001/api/filterPasses?destination=${filteredDestination}`);
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
      <nav class="navbar">
        <div class="logo">Crockett Pass Dashboard</div>
        <div className="flex items-center gap-4">
          <Link to='/'>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Current Passes
            </button>
          </Link>
          <Link to='/lookup'>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Student Lookup
            </button>
          </Link>
          <div class="dropdown">
            <button class="dropbtn">{filteredDestination} ▼</button>
            <div class="dropdown-content">
              <a onClick={() => setFilteredDestination("All")}>All</a>
              <a onClick={() => setFilteredDestination("Lavatory")}>Lavatory</a>
              <a onClick={() => setFilteredDestination("Main Office")}>Main Office</a>
              <a onClick={() => setFilteredDestination("A-House Office")}>A-House Office</a>
              <a onClick={() => setFilteredDestination("B-House Office")}>B-House Office</a>
              <a onClick={() => setFilteredDestination("Media Center")}>Media Center</a>
              <a onClick={() => setFilteredDestination("Nurse")}>Nurse</a>
              <a onClick={() => setFilteredDestination("Water")}>Water</a>
            </div>
          </div>
        </div>
      </nav>
      <div className="dashboard">
        {passes.map((pass, index) => (
          <div
            key={pass.id}
            className="pass-container"
            style={{
              marginTop: `${(index % 2) * 20}px`
            }}
          >
            <HallPass
              studentName={pass.studentName}
              location={pass.destination}
              timeOut={pass.timeOut.seconds * 1000}
              timeIn={pass.timeIn.seconds * 1000}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;