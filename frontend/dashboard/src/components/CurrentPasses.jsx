import "../App.css"
import { useState, useEffect } from "react";
import axios from "axios"
import { getBackendURL } from "../utilities";
import HallPass from "./HallPass";
import Navbar from "./Navbar";
export default function CurrentPasses() {
    const [passes, setPasses] = useState([]);
    const [filteredDestination, setFilteredDestination] = useState("All")

    useEffect(() => {
        const fetchPasses = async () => {
            try {
                let response = ""
                if (filteredDestination === "All") {
                    response = await axios.get(`${getBackendURL()}/api/getPasses`);
                } else {
                    response = await axios.get(`${getBackendURL()}/api/filterPasses?destination=${filteredDestination}`);
                }
                setPasses(response.data.responses);
            } catch (error) {
                console.error('Error fetching passes:', error);
            }
        };

        fetchPasses();

        const interval = setInterval(fetchPasses, 30000);
        return () => clearInterval(interval);
    }, [filteredDestination]);

    return (
        <>
            <Navbar />
            <div class="dropdownA">
                <button class="dropbtn">{filteredDestination} ▼</button>
                <div class="dropdown-contentA">
                    <p onClick={() => setFilteredDestination("All")}>All</p>
                    <p onClick={() => setFilteredDestination("Lavatory")}>Lavatory</p>
                    <p onClick={() => setFilteredDestination("Main Office")}>Main Office</p>
                    <p onClick={() => setFilteredDestination("A-House Office")}>A-House Office</p>
                    <p onClick={() => setFilteredDestination("B-House Office")}>B-House Office</p>
                    <p onClick={() => setFilteredDestination("Media Center")}>Media Center</p>
                    <p onClick={() => setFilteredDestination("Nurse")}>Nurse</p>
                    <p onClick={() => setFilteredDestination("Water")}>Water</p>
                </div>
            </div>
            <div className="dashboard">
                {passes.map((pass, index) => (
                    <div
                        key={`${pass.id}-${pass.timeOut.seconds}`}
                        className="pass-container"
                        style={{
                            marginTop: `${(index % 2) * 20}px`
                        }}
                    >
                        <HallPass
                            studentName={pass.studentName}
                            studentEmail={pass.email}
                            location={pass.destination}
                            timeOut={pass.timeOut.seconds * 1000}
                            timeIn={(pass.timeOut.seconds * 1000) + (5 * 60 * 1000)}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}