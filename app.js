const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const nlpRouter = require('./routes/nlp');

const app = express();

app.use(logger('dev'));
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );

app.use('/api/v1', nlpRouter);
app.use((req, res) => res.status(404).json({ error: 'Cannot get what you are looking for!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`APP RUNNING ON ${PORT}`);
});
