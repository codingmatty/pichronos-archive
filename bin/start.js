#!/usr/bin/env node
const path = require('path');

console.log('Starting Server');

process.env.PICHRONOS_ROOT_DIR = path.join(require.main.filename, '..', '..');

require('../server');
