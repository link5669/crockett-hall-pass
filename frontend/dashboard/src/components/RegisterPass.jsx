import { useState } from "react";
import Navbar from "./Navbar";
import "./RegisterPass.css";

const RegisterPass = () => {
  // State variables to store email and destination
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add further logic here, like sending data to a backend
    console.log("Submitted:", { email, destination });
  };

  return (
    <>
      <Navbar />
      <div className="student-pass-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Student Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="">Select a destination</option>
              <option value="lavatory">Lavatory</option>
              <option value="main-office">Main Office</option>
              <option value="a-house-office">A-House Office</option>
              <option value="b-house-office">B-House Office</option>
              <option value="media-center">Media Center</option>
              <option value="nurse">Nurse</option>
              <option value="water">Water</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterPass;
