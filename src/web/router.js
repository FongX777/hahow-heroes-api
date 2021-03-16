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
    await heroService.callForHeroes();
    return;
  });

  // router.get('/api/tutor/:tutor_slug', async (ctx) => {
  //   const tutorSlug = ctx.params.tutor_slug;
  //
  //   const {tutor} = await getTutorBySlug({
  //     tutorRepo, redis, publisher, url: ctx.url, tutorSlug
  //   });
  //
  //   ctx.body = {data: tutor};
  //   return;
  // });

  return router;
}

module.exports = {getRouter};
