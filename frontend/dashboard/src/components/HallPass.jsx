import { useState, useEffect } from 'react';
import "./HallPass.css"
import { getSecondsSince } from '../utilities';

function HallPass({ studentName, studentEmail, location, timeOut }) {
  const [timeLeft, setTimeLeft] = useState(300 - getSecondsSince(Number(timeOut)));
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((300 - timeLeft) / 300) * 360;

  return (<>
    <div className="hall-pass" >
      <div className="pass-content">
        <h2>Hall Pass</h2>
        <div className="student-info">
          <p className="name">Student: {studentName}</p>
          <p className="name">Email: {studentEmail}</p>
          <p className="destination">Destination: {location}</p>
        </div>
        <div className="timer-container">
          <div className="timer-circle">
            <div
              className="progress-circle"
              style={{
                background: `conic-gradient(
                  ${!isActive ? "red" : "#1a5fb4"} ${progress}deg,
                  ${!isActive ? "red" : "#93c5fd"} ${progress}deg 360deg
                )`
              }}
            />
            <div className="timer-display">
              {minutes < 0 || seconds < 0 ? <p>EXPIRED</p> : (<p>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default HallPass;