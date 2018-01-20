const express = require('express');
const path = require('path');

const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(
    path.resolve(
      path.join(require.main.filename, '..', '..', 'build', 'index.html')
    )
  );
});

router.get('/ping', function(req, res) {
  res.send('pong');
});

router.get('/config', async (req, res) => {
  try {
    const config = await db.getConfig();
    res.status(200).send({ config });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.put('/config', async (req, res) => {
  const { config } = req.body;

  try {
    const updatedConfig = await db.updateConfig(config);
    res.status(200).send({ config: updatedConfig });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
