const { Router } = require('express');
const { getAll, last, newReceiver } = require('../controllers/server');

const router = Router();

router.get('/api/all', getAll);

router.get('/api/last', last);

router.post('/api/new', newReceiver);

module.exports = router;