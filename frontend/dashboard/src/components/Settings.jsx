import { Link } from "react-router-dom";
import { useState } from "react";
import { getBackendURL } from "../utilities";
import axios from "axios";
import Navbar from "./Navbar";

export default function Settings() {
  const [rows, setRows] = useState([]);
  const [newCol1, setNewCol1] = useState("");
  const [newCol2, setNewCol2] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchData, setSearchData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { col1: newCol1, col2: newCol2 }]);
    setNewCol1("");
    setNewCol2("");
    axios.post(
      `${getBackendURL()}/api/registerConflict?studentA=${newCol1}&studentB=${newCol2}`,
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`${getBackendURL()}/api/searchConflicts?studentEmail=${searchVal}`)
      .then((e) => {
        setSearchData(e.data.responses);
      });
  };

  return (
    <>
      <Navbar />
      <h3>Student Conflicts</h3>
      {searchData != "" && (
        <div className="container">
          <table>
            <thead>
              <tr>
                <th>Student A</th>
                <th>Student B</th>
              </tr>
            </thead>
            <tbody>
              {searchData.map((pair) => (
                <tr key={pair.studentA + pair.studentB}>
                  <td>{pair.studentA}</td>
                  <td>{pair.studentB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCol1}
          onChange={(e) => setNewCol1(e.target.value)}
          placeholder="Enter Student A"
        />
        <input
          type="text"
          value={newCol2}
          onChange={(e) => setNewCol2(e.target.value)}
          placeholder="Enter Student B"
        />
        <button type="submit">Add Row</button>
      </form>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search"
        />
        <button type="submit">Conflict Search</button>
      </form>
    </>
  );
}
