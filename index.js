const express = require('express');
const cors = require('cors');
const router = require('./routes/routes');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(
  bodyParser.json({
    type() {
      return true;
    }
  })
);
app.use(router)

app.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
})