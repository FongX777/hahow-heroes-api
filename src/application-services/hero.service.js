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
    const heroes = await this._getHeroes();
    if (!heroes) {
      return;
    }
    this.responseHandler.respondOK({heroes});
    return;
  }

  async _getHeroes() {
    const requestResultOrFailure = await this.heroSourceApi.requestHeroes();
    if (requestResultOrFailure.isFailure()) {
      const {statusCode} = requestResultOrFailure.val;
      this.responseHandler.respondFailure(503, `${statusCode} from hahow server`);
      return;
    }
    const {heroes} = requestResultOrFailure.val;
    return heroes;
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

    const hero = await this._getSingleHero(heroId);
    if (!hero) {
      return;
    }
    this.responseHandler.respondOK(hero);
    return;
  }


  async callForSingleHeroWithCredential({name, password, heroId}) {
    if (!heroId) {
      this.responseHandler.respondFailure(400, 'Invalid heroId');
    }

    if (!name) {
      this.responseHandler.respondFailure(400, 'Requires name');
      return;
    }
    if (!password) {
      this.responseHandler.respondFailure(400, 'Requires password');
      return;
    }

    const authorizedOrFailure = await this.heroSourceApi.requestAuth({name, password});

    if (authorizedOrFailure.isFailure()) {
      const {statusCode} = authorizedOrFailure.val;
      if (statusCode === 400) {
        this.responseHandler.respondFailure(400, 'Bad Request');
        return;
      }
      this.responseHandler.respondFailure(503, `${statusCode} from hahow server`);
    }

    const {authorized} = authorizedOrFailure.val;

    if (!authorized) {
      this.responseHandler.respondFailure(401, `Unauthorized`);
      return;
    }


    const hero = await this._getSingleHero(heroId);
    if (!hero) {
      return;
    }
    const profileOrFailure = await this.heroSourceApi.requestHeroProfileById(heroId);
    if (profileOrFailure.isFailure()) {
      this.responseHandler.respondFailure(503, `${profileOrFailure.val.statusCode} from hahow server`);
      return;
    }


    const fullHero = {
      ...hero,
      profile: profileOrFailure.val.profile
    };

    this.responseHandler.respondOK(fullHero);
    return;
  }

  async callForHeroesWithCredential({name, password}) {
    if (!name) {
      this.responseHandler.respondFailure(400, 'Requires name');
      return;
    }
    if (!password) {
      this.responseHandler.respondFailure(400, 'Requires password');
      return;
    }

    const authorizedOrFailure = await this.heroSourceApi.requestAuth({name, password});

    if (authorizedOrFailure.isFailure()) {
      const {statusCode} = authorizedOrFailure.val;
      if (statusCode === 400) {
        this.responseHandler.respondFailure(400, 'Bad Request');
        return;
      }
      this.responseHandler.respondFailure(503, `${statusCode} from hahow server`);
    }

    const {authorized} = authorizedOrFailure.val;

    if (!authorized) {
      this.responseHandler.respondFailure(401, `Unauthorized`);
      return;
    }


    const heroes = await this._getHeroes();
    if (!heroes) {
      return;
    }
    const fullHeroes = await Promise.all(heroes.map(async hero => {
      const profileOrFailure = await this.heroSourceApi.requestHeroProfileById(hero.id);
      if (profileOrFailure.isFailure()) {
        this.responseHandler.respondFailure(503, `${profileOrFailure.val.statusCode} from hahow server`);
        return;
      }

      return {...hero, profile: profileOrFailure.val.profile};
    }));


    this.responseHandler.respondOK({heroes: fullHeroes});
    return;
  }


  async _getSingleHero(heroId) {
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
    return hero;
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
