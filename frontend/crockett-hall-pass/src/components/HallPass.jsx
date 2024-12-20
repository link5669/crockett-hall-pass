import { useState, useEffect } from 'react';
import "./HallPass.css"

function HallPass({ studentName, location, studentEmail }) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((300 - timeLeft) / 300) * 360;

  return (
    <div className="hall-pass">
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
                  #1a5fb4 ${progress}deg,
                  #93c5fd ${progress}deg 360deg
                )`
              }}
            />
            <div className="timer-display">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallPass;