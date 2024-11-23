import { useState, useEffect } from 'react';
import "./StudentView.css"
import { Link } from 'react-router-dom';
import { getBackendURL } from '../utilities';
import axios from "axios"
import "../App.css"

export default function StudentView() {
    const [name, setName] = useState('');
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newCol1, setNewCol1] = useState("")
    const [newCol2, setNewCol2] = useState("")
    const [searchVal, setSearchVal] = useState("")
    const [limitsValues, setLimitsValues] = useState("")

    const fetchPasses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://${getBackendURL()}/api/passes/student/${name}`);
            const data = await res.json();
            console.log("responses", data.responses)
            setPasses(data.responses);
            if (data.responses.length > 0) {
                getLimits(data.responses)
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const submitLimitRequest = (field, value) => {
        axios.post(`http://${getBackendURL()}/api/setCustomLimitRoute?studentName=${passes[0].studentName}&field=${field}&value=${value}`)
        getLimits(passes)
    }

    const getLimits = (passes) => {
        axios.get(`http://${getBackendURL()}/api/searchLimits?studentName=${passes[0].studentName}`).then(e => {
            let obj = {}
            obj.day = e.data.responses.length == 0 ? 3 : e.data.responses[0].day
            obj.pd = e.data.responses.length == 0 ? 1 : e.data.responses[0].pd
            setLimitsValues(obj)
        })
    }

    return (
        <>
            <nav class="navbar">
                <div class="logo">Crockett Pass Dashboard</div>
                <div className="flex items-center gap-4">
                    <Link to='/'>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                            Current Passes
                        </button>
                    </Link>
                    <Link to='/lookup'>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                            Student Lookup
                        </button>
                    </Link>
                    <Link to='/settings'>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                            Settings
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="p-4">
                <div className="mb-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter student name"
                        className="border p-2 mr-2"
                    />
                    <button
                        onClick={fetchPasses}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Search Passes
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {passes.map((pass, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap">{pass.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(pass.timeIn.seconds * 1000).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{pass.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(pass.timeOut.seconds * 1000).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {passes.length > 0 && (
                            <>
                                <h4>Set custom limits for {passes[0].studentName}</h4>
                                <h5>Current limits: </h5>
                                <p>Passes per period: {limitsValues.pd}</p>
                                <p>Passes per day: {limitsValues.day}</p>
                                <p></p>
                                <div class="dropdownA">
                                    <button class="dropbtn">Passes per pd ▼</button>
                                    <div class="dropdown-contentA">
                                        <a onClick={() => submitLimitRequest("period", "1")}>1</a>
                                        <a onClick={() => submitLimitRequest("period", "2")}>2</a>
                                        <a onClick={() => submitLimitRequest("period", "3")}>3</a>
                                        <a onClick={() => submitLimitRequest("period", "100")}>Unlimited</a>
                                    </div>
                                </div>
                                <div class="dropdownB">
                                    <button class="dropbtn">Passes per day ▼</button>
                                    <div class="dropdown-contentB">
                                        <a onClick={() => submitLimitRequest("day", "3")}>3</a>
                                        <a onClick={() => submitLimitRequest("day", "5")}>5</a>
                                        <a onClick={() => submitLimitRequest("day", "7")}>7</a>
                                        <a onClick={() => submitLimitRequest("day", "10")}>10</a>
                                        <a onClick={() => submitLimitRequest("day", "100")}>Unlimited</a>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div >
        </>
    );
}