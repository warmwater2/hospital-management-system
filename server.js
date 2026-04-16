const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HMS Backend Running 🚀");
});

let patients = [
  {
    id: 1,
    name: "Rohit Sharma",
    age: 34,
    gender: "Male",
    contact: "9876543210",
    disease: "Diabetes",
    date: "2026-04-10"
  },
  {
    id: 2,
    name: "Priya Patel",
    age: 28,
    gender: "Female",
    contact: "9123456780",
    disease: "Hypertension",
    date: "2026-04-11"
  }
];

app.get("/patients", (req, res) => {
  res.json(patients);
});

app.post("/patients", (req, res) => {
  const newPatient = {
    id: patients.length + 1,
    ...req.body
  };

  patients.push(newPatient);
  res.json(newPatient);
});

app.delete("/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  patients = patients.filter(p => p.id !== id);
  res.json({ message: "Patient deleted" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});