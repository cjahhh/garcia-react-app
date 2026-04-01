import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    if (!name || !course || !yearLevel) {
      alert("Please fill in all fields.");
      return;
    }
    await addDoc(collection(db, "students"), { name, course, yearLevel });
    alert("Record saved!");
    setName("");
    setCourse("");
    setYearLevel("");
    fetchRecords();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Student Record Form</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Course: </label>
        <input value={course} onChange={(e) => setCourse(e.target.value)} />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Year Level: </label>
        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <button onClick={handleSave}>Save</button>

      <h2 style={{ marginTop: "40px" }}>Saved Records</h2>
      {records.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Year Level</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.course}</td>
                <td>{r.yearLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;