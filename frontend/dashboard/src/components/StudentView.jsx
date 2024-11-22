import { useState, useEffect } from 'react';
import "./StudentView.css"
import { Link } from 'react-router-dom';
import { getBackendURL } from '../utilities';

export default function StudentView() {
    const [name, setName] = useState('');
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPasses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://${getBackendURL()}/api/passes/student/${name}`);
            const data = await res.json();
            console.log(data.responses[0].timeIn.seconds)
            setPasses(data.responses);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

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
                )}
            </div>
        </>
    );
}