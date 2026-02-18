const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sample endpoint
app.get('/user/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Abir Hosen' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
