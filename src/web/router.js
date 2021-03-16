const Router = require('koa-router');
const {HeroService: HeroApplicationService} = require('../application-services/hero.service');
const {ResponseHandlerInterface} = require('../application-services/contracts/response-handler');


class KoaResponseHandler extends ResponseHandlerInterface {

  constructor(ctx) {
    super();
    this.ctx = ctx;
  }

  respondOK(data) {
    this.ctx.body = data;
    this.ctx.status = 200;
  }

  respondFailure(statusCode, statusMessage) {
    this.ctx.status = statusCode;
    this.ctx.body = statusMessage;
  }
}

function getRouter({heroSourceApi}) {

  const router = new Router();

  router.get('/heroes', async (ctx) => {
    const heroService = new HeroApplicationService({heroSourceApi, responseHandler: new KoaResponseHandler(ctx)});
    const {name: name, password: password} = ctx.headers;
    if (name || password) {
      await heroService.callForHeroesWithCredential({name, password});
      return;
    }

    await heroService.callForHeroes();
    return;
  });

  router.get('/heroes/:hero_id', async (ctx) => {
    const heroId = ctx.params.hero_id;
    const {name: name, password: password} = ctx.headers;
    const heroService = new HeroApplicationService({heroSourceApi, responseHandler: new KoaResponseHandler(ctx)});

    if (name || password) {
      await heroService.callForSingleHeroWithCredential({heroId, name, password});
      return;
    }
    await heroService.callForSingleHero({heroId});
    return;
  });

  return router;
}

module.exports = {getRouter};
