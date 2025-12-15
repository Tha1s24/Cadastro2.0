const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
