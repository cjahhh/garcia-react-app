import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./App.css";

function getInitials(name) {
  return name.trim().split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [records, setRecords] = useState([]);
  const [saved, setSaved] = useState(false);

  const fetchRecords = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecords(data.reverse());
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSave = async () => {
    if (!name || !course || !yearLevel) { alert("Please fill in all fields."); return; }
    await addDoc(collection(db, "students"), { name, course, yearLevel });
    setName(""); setCourse(""); setYearLevel("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    fetchRecords();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0f6ff", minHeight: "100vh", padding: "2rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-block", background: "#dbeafe", color: "#1e40af", fontSize: "12px", fontWeight: 600, padding: "4px 14px", borderRadius: "20px", marginBottom: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Student Portal</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", fontWeight: 400, color: "#0f172a" }}>Student Record Form</h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "6px" }}>Enter and manage student enrollment data</p>
      </div>

      {/* Form Card */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2eaf8", padding: "1.75rem", maxWidth: "520px", margin: "0 auto 1.5rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "1rem" }}>Student Information</p>

        {saved && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontWeight: 500, marginBottom: "1.25rem" }}>
            ✓ Record saved successfully!
          </div>
        )}

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Stephanie Garcia"
            style={{ width: "100%", height: "42px", border: "1.5px solid #e2eaf8", borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Course</label>
            <input value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. BSIT"
              style={{ width: "100%", height: "42px", border: "1.5px solid #e2eaf8", borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>Year Level</label>
            <select value={yearLevel} onChange={e => setYearLevel(e.target.value)}
              style={{ width: "100%", height: "42px", border: "1.5px solid #e2eaf8", borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none", background: "#fff" }}>
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <button onClick={handleSave}
          style={{ width: "100%", height: "44px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Save Record
        </button>
      </div>

      {/* Records Card */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2eaf8", padding: "1.75rem", maxWidth: "520px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Saved Records</h2>
          <span style={{ background: "#eff6ff", color: "#3b82f6", fontSize: "12px", fontWeight: 600, padding: "2px 10px", borderRadius: "20px" }}>{records.length} students</span>
        </div>

        {records.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", padding: "2rem 0" }}>No records yet. Add one above.</p>
        ) : (
          records.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#1d4ed8", flexShrink: 0 }}>
                {getInitials(r.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{r.name}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{r.course}</div>
              </div>
              <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>{r.yearLevel}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;