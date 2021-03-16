const Koa = require('koa');
const {getRouter} = require('./router');
const {HeroSourceApi} = require('../external-resources/hero-source');
const httpRequest = require('../external-resources/http-request');


function createServer({config}) {
  const server = new Koa();

  server.use(getRouter({
    heroSourceApi: new HeroSourceApi({httpRequest, host: config.externalResources.hahow.host})
  }).routes());


  return {
    listen: () => server.listen(config.web.port),
  };
}

module.exports = {createServer};
