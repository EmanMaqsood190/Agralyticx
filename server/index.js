require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', require('./routes/users'));
app.use('/api/farm-data', require('./routes/farmData'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/land-records', require('./routes/landRecords'));
app.use('/api/farmer-jobs', require('./routes/farmerJobs'));
app.use('/api/transport-bookings', require('./routes/transportBookings'));
app.use('/api/community', require('./routes/community'));
app.use('/api/crop-scans', require('./routes/cropScans'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));