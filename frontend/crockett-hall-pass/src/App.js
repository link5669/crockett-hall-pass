import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import HallPass from './components/HallPass';

function App() {
  const [user, setUser] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('');
  const [view, setView] = useState("register")
  const handleChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setView("pass")
  }
  return (
    <div className="App">
      <header className="App-header">
        {view == "register" ? (
          <>
            {user == null ? (
              <GoogleLogin
                onSuccess={credentialResponse => {
                  const userObject = jwtDecode(credentialResponse.credential);
                  const email = userObject.email;
                  const name = userObject.name;
                  const firstName = userObject.given_name;
                  const lastName = userObject.family_name;
                  const picture = userObject.picture;
                  setUser(name)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                scope="email profile"
              />
            ) : (
              <>
                <h2>Welcome, {user}</h2>
                <p>Select a reason:</p>
                <form>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="lavatory"
                        name="location"
                        value="Lavatory"
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
                        onChange={handleChange}
                      />
                      <label htmlFor="bHouseOffice">B-House Office</label>
                    </div>

                    <div className="radio-option">
                      <input
                        type="radio"
                        id="mediaCenter"
                        name="location"
                        value="MediaCenter"
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
                        onChange={handleChange}
                      />
                      <label htmlFor="water">Water</label>
                    </div>
                  </div>
                  <button onClick={handleSubmit} type="submit" className="submit-button">
                    Submit
                  </button>
                </form>
              </>
            )}</>
        ) : (<>
          <HallPass studentName={user} location={selectedLocation}/>
        </>)}
      </header>
    </div>
  );
}

export default App;