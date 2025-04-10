const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes'); 
const auth = require('./src/middleware/auth');

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tripzy')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
app.use(authRoutes);  
app.use(userRoutes);  

// ✅ Public route
app.get('/', (req, res) => res.render('index'));

// ✅ Protected route
app.get('/home', auth, (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/packages', (req, res) => {
  res.render('packages');
});


app.get('/customize', (req, res) => {
  res.render('customize');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/views/partials/header', (req, res) => {
  res.render('/views/partials/header');
});



app.use((req, res) => {
  res.status(404).render('404');
});




// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
