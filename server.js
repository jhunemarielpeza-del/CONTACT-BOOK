const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./Routes/authRoutes');
const contactRoutes = require('./Routes/contactRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// Fallback: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'Index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});