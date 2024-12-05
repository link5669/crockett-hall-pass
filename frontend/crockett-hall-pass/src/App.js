import "./App.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import HallPass from "./components/HallPass";
import axios from "axios";
import { closestStartingBell, getBackendURL } from "./utilities";
import { Timestamp } from "firebase/firestore";
import { findSimilar } from "find-similar";

function App() {
  const [user, setUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [view, setView] = useState("register");
  const [requestResponse, setRequestResponse] = useState("");
  const [pd, setPd] = useState("0");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffDir, setStaffDir] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setSuggestions(findSimilar(staffEmail, staffDir));
    console.log(
      staffDir,
      staffEmail,
      findSimilar(staffEmail, staffDir, { maxScore: 1, criteria: 0.1 }),
    );
  }, [staffEmail]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  useEffect(() => {
    if (staffDir.length == 0) {
      axios
        .get(`${getBackendURL()}/api/getStaff`)
        .then((e) => setStaffDir(e.data.responses.map((a) => a.email)));
    }
    setPd(closestStartingBell(Timestamp.now()));
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedLocation == "") {
      setError("Please select a destination!");
      return;
    }
    if (staffEmail == "") {
      setError("Please select a staff member!");
      return;
    }
    try {
      const response = await axios.post(
        `${getBackendURL()}/api/requestPass?studentName=${user[0]}&studentEmail=${user[1]}&destination=${selectedLocation}&staffEmail=${staffEmail}`,
      );
      console.log("a");
      if (response.status === 200) {
        console.log("b");
        setRequestResponse(response.data.message);
        if (response.data.message != "Request processed") {
          setView("error");
          return;
        }
        setView("awaiting response");

        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await axios.get(
              `${getBackendURL()}/api/passes/student-request/${user[1]}`,
            );
            console.log("asd", statusResponse.data);
            if (statusResponse.data.responses.length > 0) {
              clearInterval(pollInterval);
              setView("response received");
            }
          } catch (error) {
            console.error("Error checking status:", error);
            clearInterval(pollInterval);
            setRequestResponse("Error checking request status");
          }
        }, 2000);

        return () => clearInterval(pollInterval);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setRequestResponse("Error submitting request");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {view === "register" ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "24px",
                padding: "32px",
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Welcome
                  </h2>
                  {user == null ? (
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const userObject = jwtDecode(
                          credentialResponse.credential,
                        );
                        const email = userObject.email;
                        const name = userObject.name;
                        setUser([name, email]);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                      scope="email profile"
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#4a5568",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {user[0]}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Current Period
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#4a5568",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {pd}
                    {pd == 1 ? (
                      <>st</>
                    ) : pd == 2 ? (
                      <>nd</>
                    ) : pd == 3 ? (
                      <>rd</>
                    ) : (
                      <>th</>
                    )}{" "}
                    Period
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#718096",
                      margin: "0",
                    }}
                  >
                    {new Date(Date.now()).toLocaleDateString()}
                  </p>
                </div>

                {/* Quick Actions */}
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Quick Actions
                  </h2>
                  {user == null ? (
                    <p style={{ color: "black", fontSize: "14px" }}>
                      Log in to see actions
                    </p>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "#4285f4",
                        color: "white",
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "15px",
                        width: "100%",
                        marginBottom: "12px",
                      }}
                      onClick={() => setView("passRequest")}
                    >
                      Request Pass
                    </button>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    gridColumn: "1 / -1",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Recent Passes
                  </h2>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "15px",
                    }}
                  >
                    No recent passes to display
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Today's Schedule
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 1
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        8:35 AM - 9:15 AM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 2
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        9:18 AM - 9:58 AM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 3
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        10:01 AM - 10:41 AM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 4
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        10:44 AM - 11:24 AM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 5
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        11:27 AM - 12:07 PM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 6
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        12:10 PM - 12:50 PM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 7
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        12:53 PM - 1:33 PM
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#4a5568",
                          fontSize: "20px",
                        }}
                      >
                        Period 8
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "14px",
                          color: "#718096",
                        }}
                      >
                        1:36 PM - 2:16 PM
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0",
                        color: "#4a5568",
                        fontSize: "20px",
                      }}
                    >
                      Period 9
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "14px",
                        color: "#718096",
                      }}
                    >
                      1:39 PM - 3:00 PM
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "20px",
                      color: "#1a1f36",
                    }}
                  >
                    Notifications
                  </h2>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "15px",
                    }}
                  >
                    No new notifications
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : view == "passRequest" ? (
          <>
            <h2>Welcome, {user[0]}</h2>
            <div className="staff-input-container" ref={containerRef}>
              <p>Which staff member should be notified?</p>
              <div className="input-with-suggestions">
                <input
                  type="text"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Start typing a name or email..."
                />
                {staffEmail != "" &&
                  showSuggestions &&
                  suggestions.length > 0 && (
                    <div className="suggestions-menu">
                      {suggestions.slice(0, 4).map((suggestion, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => {
                            setStaffEmail(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
            <p>Select a destination:</p>
            <form onSubmit={handleSubmit}>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="lavatory"
                    name="location"
                    value="Lavatory"
                    checked={selectedLocation === "Lavatory"}
                    onChange={handleChange}
                  />
                  <label htmlFor="lavatory">Lavatory</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="mainOffice"
                    name="location"
                    value="Main Office"
                    checked={selectedLocation === "Main Office"}
                    onChange={handleChange}
                  />
                  <label htmlFor="mainOffice">Main Office</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="aHouseOffice"
                    name="location"
                    value="A-House Office"
                    checked={selectedLocation === "A-House Office"}
                    onChange={handleChange}
                  />
                  <label htmlFor="aHouseOffice">A-House Office</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="bHouseOffice"
                    name="location"
                    value="B-House Office"
                    checked={selectedLocation === "B-House Office"}
                    onChange={handleChange}
                  />
                  <label htmlFor="bHouseOffice">B-House Office</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="mediaCenter"
                    name="location"
                    value="Media Center"
                    checked={selectedLocation === "Media Center"}
                    onChange={handleChange}
                  />
                  <label htmlFor="mediaCenter">Media Center</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="nurse"
                    name="location"
                    value="Nurse"
                    checked={selectedLocation === "Nurse"}
                    onChange={handleChange}
                  />
                  <label htmlFor="nurse">Nurse</label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="water"
                    name="location"
                    value="Water"
                    checked={selectedLocation === "Water"}
                    onChange={handleChange}
                  />
                  <label htmlFor="water">Water</label>
                </div>
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
              <br />
              {<p style={{ color: "red" }}>{error}</p>}
            </form>
          </>
        ) : view === "awaiting response" ? (
          <p>Awaiting response...</p>
        ) : requestResponse === "Request processed" ? (
          <>
            <HallPass
              studentName={user[0]}
              studentEmail={user[1]}
              location={selectedLocation}
            />
          </>
        ) : (
          <p>{requestResponse}</p>
        )}
      </header>
    </div>
  );
}

export default App;
