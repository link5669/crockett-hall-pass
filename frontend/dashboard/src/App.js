import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { getBackendURL } from "./utilities";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRequests, setCurrentRequests] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (localStorage.getItem("loggedIn") == "true") {
      const ONE_HOUR = 3600000;
      const loginDate = parseInt(localStorage.getItem("loginDate"));
      //only for local use, do not change to ISO
      const timeSinceLogin = Date.now() - loginDate;
      if (timeSinceLogin < ONE_HOUR) {
        setLoggedIn(true);
      }
    }
  });

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (currentRequests.length == 0)
        axios
          .get(`${getBackendURL()}/api/getRequests?email=${email}`)
          .then((e) => {
            setCurrentRequests(e.data.responses);
          });
    }, 3000);
    return () => clearInterval(pollInterval);
  });

  const handleApproval = async (pass, newApprovalStatus) => {
    try {
      await axios.post(
        `${getBackendURL()}/api/registerPass?studentName=${pass.studentName}&studentEmail=${pass.email}&destination=${pass.destination}&requestID=${pass.id}`,
      );
      setCurrentRequests(currentRequests.filter((a) => a.id != pass.id));
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <>
      {loggedIn ? (
        <>
          <Navbar />
          <h2 style={{ padding: "20px" }}>Pending Passes:</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approve?
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRequests.length == 0 && <p>No pending passes!</p>}
              {currentRequests.map((pass, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pass.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pass.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(pass.timeOut.seconds * 1000).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleApproval(pass, true)}
                      className={`p-2 rounded text-green-600 hover:text-green-800`}
                    >
                      {"✓"}
                    </button>
                    <button
                      onClick={() => handleApproval(pass, false)}
                      className={`p-2 rounded text-red-600 hover:text-red-800`}
                    >
                      {"✗"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <br />
          <p style={{ color: "gray" }}>
            Data should refresh every three seconds, please reload the page if
            you encounter any issues. Please contact{" "}
            <a target="_blank" href="mailto:macquaviva@htsdnj.org">
              Miles
            </a>{" "}
            if you encounter any bugs.
          </p>
        </>
      ) : (
        <Login setLoggedIn={setLoggedIn} setEmail={setEmail} />
      )}
    </>
  );
}

export default App;
