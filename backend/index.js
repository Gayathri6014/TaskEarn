const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // To parse JSON data in requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskearn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// User schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send('User already exists');

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).send('User registered successfully');
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, 'secretKey');
  res.json({ token });
});

// Start server
app.listen(4001, () => {
  console.log('Server is running on port 4001');
});
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use the same secret used to sign the token
        req.user = decoded; // Attach the decoded user info to request
        next(); // Proceed to the protected route
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Example protected route
app.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'This is the profile page',
        user: req.user // Access the decoded user data
    });
});

// Login route (for testing purposes)
app.post('/login', (req, res) => {
    const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' }; // Example user
    const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' }); // Sign the JWT
    res.json({ token }); // Send token back to client
});

// Start the server
app.listen(4001, () => {
    console.log('Server is running on port 4001');
});
