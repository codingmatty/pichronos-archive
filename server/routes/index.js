const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.get("/config", async (req, res) => {
  try {
    const config = await db.getConfig();
    res.status(200).send({ config });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.put("/config", async (req, res) => {
  const { config } = req.body;

  try {
    const updatedConfig = await db.updateConfig(config);
    res.status(200).send({ config: updatedConfig });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
