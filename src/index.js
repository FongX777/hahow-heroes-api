const {config} = require('./config');
const {createServer} = require('./web');

createServer({ config }).listen();

