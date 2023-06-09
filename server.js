const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Student = require('./models/students')

const port = 5000;
const app = express();

// Middleware za parsiranje JSON podataka
app.use(bodyParser.json());

// Povežite se s MongoDB Atlas bazom podataka
mongoose.connect('mongodb+srv://mehmed:mehmed1234@cluster0.vskquvr.mongodb.net/?retryWrites=true&w=majority').then(() => {
  console.log('connected to MongoDB')
  app.listen(3000, ()=> {
      console.log(`Node API app is running on port ${port}`)
  })}).catch((error) => {
    console.log(error)
})

// CRUD rute

// CREATE
app.post('/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body)
    res.status(200).json(newStudent);
    
} catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
}})

// READ
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.get('/students/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const newStudent = await Student.findByIdAndUpdate(id, req.body);
    if(!newStudent){
        return res.status(404).json({message: `cannot find any student with ID ${id}`})
    }
    const updatedStudent = await Student.findById(id);
    res.status(200).json(updatedStudent);
    
} catch (error) {
    res.status(500).json({message: error.message})
}
})
// UPDATE
app.put('/students/:id', async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedStudent) return res.status(404).send('Student not found');
  res.send(updatedStudent);
});

// DELETE
app.delete('/students/:id', async (req, res) => {
  const deletedStudent = await Student.findByIdAndDelete(req.params.id);
  if (!deletedStudent) return res.status(404).send('Student not found');
  res.send(deletedStudent);
});

// Pokrenite server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});