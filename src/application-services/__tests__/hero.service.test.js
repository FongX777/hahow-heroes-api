const test = require('ava');
const {HeroService, callForHeroes, callForSingleHero, callForHeroesWithCredentials} = require('../hero.service');
const {ResponseHandlerInterface} = require('../contracts/response-handler');
const {HeroSourceApi, success, failure} = require('../../external-resources/hero-source');


class MockHeroSourceApi extends HeroSourceApi {
  static fixtureData() {
    return {
      heroes: [
        {
          id: "1",
          name: "Daredevil",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
        },
        {
          id: "2",
          name: "Thor",
          image: "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg",
        },
        {
          id: "3",
          name: "Iron Man",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg",
        },
        {
          id: "4",
          name: "Hulk",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg",
        }
      ],
      profiles: [
        {id: "1", profile: {str: 6, int: 9, agi: 6, luk: 9}},
        {id: "2", profile: {str: 6, int: 9, agi: 6, luk: 9}},
        {id: "3", profile: {str: 6, int: 9, agi: 6, luk: 9}},
        {id: "4", profile: {str: 6, int: 9, agi: 6, luk: 9}}
      ],
      credentials: [
        {name: 'hahow', password: 'rocks'},
      ]
    };
  }

  constructor() {
    super({}, 'https://hahow-recruit.herokuapp.com');
    this.requestHeroesCalled = false;
    this.requestHeroByIdCalled = false;
  }

  async requestHeroes() {
    this.requestHeroesCalled = true;
    return success({
      heroes: MockHeroSourceApi.fixtureData().heroes
    });
  }

  async requestHeroById(id) {
    this.requestHeroByIdCalled = true;
    const hero = MockHeroSourceApi.fixtureData().heroes.find(hero => hero.id === id);
    return hero ? success({hero}) : failure({statusCode: 404, statusMessage: 'Not Found'});

  }

  async requestAuth({name, password}) {
    const auth = MockHeroSourceApi.fixtureData().credentials.find(cred => cred.name === name && cred.password === password);
    return success({authorized: !!auth});
  }

  async requestHeroProfileById(id) {
    const profileWithId = MockHeroSourceApi.fixtureData(true).profiles.find(profile => profile.id === id);
    return profileWithId ? success({profile: profileWithId.profile}) : failure({
      statusCode: 404,
      statusMessage: 'Not Found'
    });
  }

}

class MockResponseHandler extends ResponseHandlerInterface {
  constructor() {
    super();
    this.statusCode = 400;
    this.data = undefined;
    this.message = undefined;
  }

  respondOK(data) {
    this.statusCode = 200;
    this.data = data;
  }

  respondFailure(code, msg) {
    this.statusCode = code;
    this.message = msg;
  }

}

test.beforeEach(t => {
  const responseHandler = new MockResponseHandler();
  const heroSourceApi = new MockHeroSourceApi();
  t.context = {
    responseHandler,
    heroSourceApi,
    heroService: new HeroService({heroSourceApi, responseHandler})
  };
});


test('get heroes should return 4 heroes', async t => {
  const {heroService, responseHandler} = t.context;

  await heroService.callForHeroes();

  const heroes = responseHandler.data.heroes;
  t.is(heroes.length, 4);
  t.is(heroes[0].id, '1');
  t.is(heroes[0].name, 'Daredevil');
});

test('given the hahow server is down, get heroes should failed with 503 Service Unavailable Error', async t => {
  const {heroService, responseHandler, heroSourceApi} = t.context;
  heroSourceApi.requestHeroes = () => failure({statusCode: 500, statusMessage: 'Internal Server Error'});

  await heroService.callForHeroes();
  t.is(responseHandler.statusCode, 503);
});


test('get an hero should return an hero', async t => {
  const {heroService, responseHandler} = t.context;
  await heroService.callForSingleHero({heroId: '1'});

  const hero = responseHandler.data;
  t.is(hero.id, '1');
});

test('get an hero with non-exists id should receive 404', async t => {
  const {heroService, responseHandler, heroSourceApi} = t.context;
  heroSourceApi.requestHeroById = () => failure({statusCode: 404, statusMessage: 'Not Found'});


  await heroService.callForSingleHero({heroId: '100000000000000'});

  t.is(responseHandler.statusCode, 404);
});


test('authorized user get single hero should return an hero', async t => {
  const {heroService, responseHandler} = t.context;
  await heroService.callForSingleHeroWithCredential({name: 'hahow', password: 'rocks', heroId: '1'});

  const hero = responseHandler.data;
  t.is(hero.id, '1');
  t.is(hero.profile.str, 6);
});

test('user with incorrect authorized credential get single hero should receive 401', async t => {
  const {heroService, responseHandler} = t.context;
  await heroService.callForSingleHeroWithCredential({name: 'incorrect...', password: 'rockssss', heroId: '1'});

  t.is(responseHandler.statusCode, 401);
});

test('authorized user get heroes should return heroes', async t => {
  const {heroService, responseHandler} = t.context;
  await heroService.callForHeroesWithCredential({name: 'hahow', password: 'rocks'});

  const heroes = responseHandler.data.heroes;
  t.is(heroes.length, 4);
  t.is(heroes[0].id, '1');
  t.is(heroes[0].profile.str, 6);
});
