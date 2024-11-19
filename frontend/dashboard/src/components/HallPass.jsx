import { useState, useEffect } from 'react';
import "./HallPass.css"
import { getSecondsSince } from '../utilities';

function HallPass({ studentName, location, timeOut, timeIn }) {
  const [timeLeft, setTimeLeft] = useState(300 - getSecondsSince(Number(timeOut)));
  const [isActive, setIsActive] = useState(true);
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    console.log(timeOut)
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
        if (timeLeft < -120) {
          setVisible(false)
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((300 - timeLeft) / 300) * 360;

  return (<>
    {visible == true ? (
      <div className="hall-pass" >
        <div className="pass-content">
          <h2>Hall Pass</h2>
          <div className="student-info">
            <p className="name">Student: {studentName}</p>
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
    ) : <></>}
  </>);
}

export default HallPass;