const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// MongoDB URI (will be set after receiving it from the form)
//pass on text form mongodb+srv://user1:LeratoJK127@cluster0.vgapz6p.mongodb.net/

let mongoURI = '';

// Connect to MongoDB function
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Define a MongoDB schema and model
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  myName: String,
  mySID: String
});
//Add the data to a collecPon named “s24students”.
const Student = mongoose.model('s24students', studentSchema);

// Root route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

// POST route to handle form submission
app.post('/', async (req, res) => {
  // Extract MongoDB URI from form data
  mongoURI = req.body.myuri;

  // Connect to MongoDB using the received URI
  await connectToMongoDB();

  // Hardcoded student information (replace with your actual details)
  const myName = 'Liako'; // my name
  const mySID = '300381719 LeratoJK127'; // id

  // Create a new student document
  const newStudent = new Student({
    myName,
    mySID
  });

  // Save the new student document to MongoDB
  try {
    await newStudent.save();
    console.log('Student data added to MongoDB');
    res.send('<h1>Document Added</h1>');
  } catch (error) {
    console.error('Error saving student data:', error);
    res.status(500).send('Error saving student data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});