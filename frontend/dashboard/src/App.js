import { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"
import { getBackendURL } from './utilities';
import Login from './components/Login';
import Navbar from './components/Navbar';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentRequests, setCurrentRequests] = useState([])

  useEffect(() => {
    if (localStorage.getItem('loggedIn') == 'true') {
      const ONE_HOUR = 3600000;
      const loginDate = parseInt(localStorage.getItem('loginDate'));
      //only for local use, do not change to ISO
      const timeSinceLogin = Date.now() - loginDate;
      if (timeSinceLogin < ONE_HOUR) {
        setLoggedIn(true)
      }
    }
  })

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (currentRequests.length == 0)
        axios.get(`${getBackendURL()}/api/getRequests`).then(e => {
      console.log(e.data)
          setCurrentRequests(e.data.responses)
        })
    }, 3000);

    return () => clearInterval(pollInterval);
  })

  const handleApproval = async (pass, newApprovalStatus) => {
    console.log(pass)
    try {
      await axios.post(`${getBackendURL()}/api/registerPass?studentName=${pass.studentName}&studentEmail=${pass.email}&destination=${pass.destination}&requestID=${pass.id}`)
      console.log(currentRequests[0].id, pass.id)
      setCurrentRequests(currentRequests.filter(a => a.id != pass.id))
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  return (
    <>
      {loggedIn ? (<>
        <Navbar />
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Requested</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approve?</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRequests.map((pass, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{pass.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pass.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(pass.timeOut.seconds * 1000).toLocaleTimeString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleApproval(pass, true)}
                    className={`p-2 rounded text-green-600 hover:text-green-800`}
                  >
                    {'✓'}
                  </button>
                  <button
                    onClick={() => handleApproval(pass, false)}
                    className={`p-2 rounded text-red-600 hover:text-red-800`}
                  >
                    {'✗'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      ) : (
        <Login setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default App;