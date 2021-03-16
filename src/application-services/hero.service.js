class HeroService {
  /**
   * @param {Object} params
   * @param {HeroSourceApi} params.heroSourceApi
   * @param {ResponseHandlerInterface} params.responseHandler
   */
  constructor({heroSourceApi, responseHandler}) {
    this._heroSourceApi = heroSourceApi;
    this._responseHandler = responseHandler;
  }

  get heroSourceApi() {
    return this._heroSourceApi;
  }

  get responseHandler() {
    return this._responseHandler;
  }

  async callForHeroes() {
    const requestResultOrFailure = await this.heroSourceApi.requestHeroes();
    if (requestResultOrFailure.isFailure()) {
      const {statusCode} = requestResultOrFailure.val;
      this.responseHandler.respondFailure(503, `${statusCode} from hahow server`);
      return;
    }
    const {heroes} = requestResultOrFailure.val;
    this.responseHandler.respondOK({heroes});
    return;
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.heroId
   * @returns {Promise<void>}
   */
  async callForSingleHero({heroId}) {
    if (heroId === undefined) {
      this.responseHandler.respondFailure(400, 'Invalid heroId');
    }

    const requestResultOrFailure = await this.heroSourceApi.requestHeroById(heroId);

    if (requestResultOrFailure.isFailure()) {
      const {statusCode} = requestResultOrFailure.val;
      if (statusCode === 404) {
        this.responseHandler.respondFailure(404, `${statusCode} from hahow server`);
        return;
      }

      this.responseHandler.respondFailure(503, `${statusCode} from hahow server`);
      return;
    }

    const {hero} = requestResultOrFailure.val;
    this.responseHandler.respondOK({hero});
    return;
  }
}


/**
 * @param heroSourceApi
 * @param{ResponseHandlerInterface} responseHandler
 */
async function callForHeroes({heroSourceApi, responseHandler}) {

  const requestResultOrFailure = await heroSourceApi.requestHeroes();
  if (requestResultOrFailure.isFailure()) {
    const {statusCode} = requestResultOrFailure.val;
    responseHandler.respondFailure(503, `${statusCode} from hahow server`);
    return;
  }

  const {heroes} = requestResultOrFailure.val;
  responseHandler.respondOK({heroes});
  return;
}

async function callForSingleHero({heroId, heroSourceApi, responseHandler}) {
  if (heroId === undefined) {
    responseHandler.respondFailure(400, 'Invalid heroId');
  }

  const requestResultOrFailure = await heroSourceApi.requestHeroById(heroId);

  if (requestResultOrFailure.isFailure()) {
    const {statusCode} = requestResultOrFailure.val;
    if (statusCode === 404) {
      responseHandler.respondFailure(404, `${statusCode} from hahow server`);
      return;
    }

    responseHandler.respondFailure(503, `${statusCode} from hahow server`);
    return;
  }

  const {hero} = requestResultOrFailure.val;
  responseHandler.respondOK({hero});
  return;
}


module.exports = {callForHeroes, callForSingleHero, HeroService};
