const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); 

const readData = () => {
  const data = fs.readFileSync('db.json');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

app.get('/instructors', (req, res) => {
  const data = readData();
  res.json(data.instructors);
});

app.post('/instructors', (req, res) => {
  const data = readData();
  const newInstructor = { id: Date.now(), ...req.body };
  data.instructors.push(newInstructor);
  writeData(data);
  res.status(201).json(newInstructor);
});

app.put('/instructors/:id', (req, res) => {
  const data = readData();
  const index = data.instructors.findIndex(instr => instr.id == req.params.id);
  if (index !== -1) {
    data.instructors[index] = { id: req.params.id, ...req.body };
    writeData(data);
    res.json(data.instructors[index]);
  } else {
    res.status(404).send('Instructor not found');
  }
});

app.delete('/instructors/:id', (req, res) => {
  const data = readData();
  const newInstructors = data.instructors.filter(instr => instr.id != req.params.id);
  if (newInstructors.length !== data.instructors.length) {
    data.instructors = newInstructors;
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send('Instructor not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
