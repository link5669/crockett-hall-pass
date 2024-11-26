import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import HallPass from './components/HallPass';
import axios from "axios"
import { closestStartingBell, getBackendURL } from './utilities';
import { Timestamp } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('');
  const [view, setView] = useState("register")
  const [requestResponse, setRequestResponse] = useState("")
  const [pd, setPd] = useState("0")
  const handleChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  useEffect(() => {
    setPd(closestStartingBell(Timestamp.now()))
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${getBackendURL()}/api/registerPass?studentName=${user[0]}&studentEmail=${user[1]}&destination=${selectedLocation}`).then((r) => {
      if (r.status != 200) {
        handleSubmit(e)
      }
      setRequestResponse(r.data.message)
    })
    setView("pass")
  }

  return (
    <div className="App">
      <header className="App-header">
        {view === "register" ? (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '24px',
              padding: '32px',
              minHeight: '100vh',
              backgroundColor: '#f5f7fb',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              {/* Left Sidebar */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {/* Profile Section */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Welcome</h2>
                  {user == null ? (
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        const userObject = jwtDecode(credentialResponse.credential);
                        const email = userObject.email;
                        const name = userObject.name;
                        setUser([name, email])
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                      scope="email profile"
                    />
                  ) : (
                    <p style={{
                      fontSize: '16px',
                      color: '#4a5568',
                      margin: '0 0 8px 0'
                    }}>{user[0]}</p>
                  )}
                </div>

                {/* Schedule Info */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Current Period</h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#4a5568',
                    margin: '0 0 8px 0'
                  }}>
                    {pd}{pd == 1 ? <>st</> : pd == 2 ? <>nd</> : pd == 3 ? <>rd</> : <>th</>} Period
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#718096',
                    margin: '0'
                  }}>
                    {new Date(Date.now()).toLocaleDateString()}
                  </p>
                </div>

                {/* Quick Actions */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Quick Actions</h2>
                  {user == null ? (<p style={{ color: 'black', fontSize: '14px' }}>Log in to see actions</p>) : (
                    <button style={{
                      backgroundColor: '#4285f4',
                      color: 'white',
                      padding: '12px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      width: '100%',
                      marginBottom: '12px'
                    }} onClick={() => setView("passRequest")}>
                      Request Pass
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {/* Recent Passes */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  gridColumn: '1 / -1'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Recent Passes</h2>
                  <p style={{
                    color: '#718096',
                    fontSize: '15px'
                  }}>No recent passes to display</p>
                </div>

                {/* Upcoming Classes */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Today's Schedule</h2>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 1</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>8:35 AM - 9:15 AM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 2</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>9:18 AM - 9:58 AM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 3</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>10:01 AM - 10:41 AM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 4</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>10:44 AM - 11:24 AM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 5</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>11:27 AM - 12:07 PM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 6</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>12:10 PM - 12:50 PM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 7</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>12:53 PM - 1:33 PM</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 8</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>1:36 PM - 2:16 PM</p>
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px'
                  }}>
                    <p style={{ margin: '0', color: '#4a5568', fontSize: '20px' }}>Period 9</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#718096' }}>1:39 PM - 3:00 PM</p>
                  </div>
                </div>

                {/* Notifications */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    color: '#1a1f36'
                  }}>Notifications</h2>
                  <p style={{
                    color: '#718096',
                    fontSize: '15px'
                  }}>No new notifications</p>
                </div>
              </div>
            </div>
          </>
        ) : view == "passRequest" ? (
          <>
            <h2>Welcome, {user[0]}</h2>
            <p>Select a reason:</p>
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
            </form>
          </>
        ) : requestResponse === "Request processed" ? (<>
          <HallPass studentName={user[0]} studentEmail={user[1]} location={selectedLocation} />
        </>) : (<p>{requestResponse}</p>)}
      </header>
    </div >
  );
}

export default App;