const express = require('express');
const app = express();
const port = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  console.log('========================\n');
  next();
});

// Single catch-all route handler for all methods
app.use((req, res) => {
  res.json({
    message: `Test server ${req.method} response`,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
});

app.listen(port, () => {
  console.log('\n===========================================');
  console.log(`Test server running at http://localhost:${port}`);
  console.log('Ready to accept all requests');
  console.log('===========================================\n');
}); 