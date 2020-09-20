const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const photos = require('./routes/photos');
const auth = require('./routes/auth');

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.static('public'));

app.use(cookieParser());

// Connect Database
require('./config/db').connectDB();

// Use body parser.
app.use(express.json());

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/photos', photos);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
