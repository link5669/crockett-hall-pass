import { Link } from "react-router-dom"
import { useState } from "react";
import { getBackendURL } from "../utilities";
import axios from "axios"

export default function Settings() {
    const [rows, setRows] = useState([]);
    const [newCol1, setNewCol1] = useState('');
    const [newCol2, setNewCol2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setRows([...rows, { col1: newCol1, col2: newCol2 }]);
        setNewCol1('');
        setNewCol2('');
        axios.post(`http://${getBackendURL()}/api/registerConflict?studentA=${newCol1}&studentB=${newCol2}`)
    };

    return (<><nav class="navbar">
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


        <div className="container">
            <h3>Student Conflicts</h3>
            <table>
                <thead>
                    <tr>
                        <th>Student A</th>
                        <th>Student B</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.col1}</td>
                            <td>{row.col2}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newCol1}
                    onChange={(e) => setNewCol1(e.target.value)}
                    placeholder="Enter Column 1"
                />
                <input
                    type="text"
                    value={newCol2}
                    onChange={(e) => setNewCol2(e.target.value)}
                    placeholder="Enter Column 2"
                />
                <button type="submit">Add Row</button>
            </form>
        </div>
    </>)
}