const level = require('level');
const path = require('path');

const db = level(
  path.resolve(path.join(require.main.filename, '..', '..', 'db'))
);

const { NotFoundError } = level;

async function initializeConfig() {
  try {
    const savedConfig = await db.get('config');
  } catch (error) {
    if (error.type == 'NotFoundError') {
      await db.put('config', JSON.stringify({}));
      console.log('Config Created!');
    }
  }
}

initializeConfig();

exports.getConfig = async function() {
  const savedConfig = await db.get('config');

  return JSON.parse(savedConfig);
};

exports.updateConfig = async function(newConfig) {
  const savedConfig = await db.get('config');
  const configUpdate = Object.assign({}, JSON.parse(savedConfig), newConfig);

  try {
    await db.put('config', JSON.stringify(configUpdate));
    const updatedConfig = await db.get('config');
    return JSON.parse(updatedConfig);
  } catch (error) {
    console.error(error);
  }
};
