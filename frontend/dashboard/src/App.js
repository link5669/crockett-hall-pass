// components/Dashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import HallPass from './components/HallPass';
import "./App.css"
function App() {
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/getPasses');
        setPasses(response.data.responses);
      } catch (error) {
        console.error('Error fetching passes:', error);
      }
    };

    fetchPasses();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPasses, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
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
            timeOut={pass.timeOut}
            timeIn={pass.timeIn}
          />
        </div>
      ))}
    </div>
  );
}

export default App;