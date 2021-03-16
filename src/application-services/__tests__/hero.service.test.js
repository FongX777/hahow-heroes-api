const test = require('ava');
const {HeroService, callForHeroes, callForSingleHero, callForHeroesWithCredentials} = require('../hero.service');
const {ResponseHandlerInterface} = require('../contracts/response-handler');
const {HeroSourceApi, success, failure} = require('../../external-resources/hero-source');


class MockHeroSourceApi extends HeroSourceApi {
  constructor() {
    super({}, 'https://hahow-recruit.herokuapp.com');
    this.requestHeroesCalled = false;
    this.requestHeroByIdCalled = false;
  }

  async requestHeroes() {
    this.requestHeroesCalled = true;
    return success({
      heroes: [
        {
          id: "1",
          name: "Daredevil",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
        },
        {
          id: "2",
          name: "Thor",
          image: "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
        },
        {
          id: "3",
          name: "Iron Man",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6/standard_xlarge.jpg"
        },
        {
          id: "4",
          name: "Hulk",
          image: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/standard_xlarge.jpg"
        }
      ]
    });
  }

  async requestHeroById(id) {
    this.requestHeroByIdCalled = true;
    return success({
      hero: {
        id,
        name: "Daredevil",
        image: "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
      }
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

  const hero = responseHandler.data.hero;
  t.is(hero.id, '1');
});

test('get an hero with non-exists id should return no hero', async t => {
  const responseHandler = new MockResponseHandler();
  const heroSourceApi = new MockHeroSourceApi();
  heroSourceApi.requestHeroById = () => failure({statusCode: 404, statusMessage: 'Not Found'});


  await callForSingleHero({
    heroId: '100000000000000',
    heroSourceApi,
    responseHandler,
  });

  t.is(responseHandler.statusCode, 404);
});


// test('authorized user get heroes should return heroes', async t => {
//   const responseHandler = new MockResponseHandler();
//   await callForHeroesWithCredentials({
//     credentials: {Name: 'hahow', Password: 'rocks'},
//     heroSourceApi: new MockHeroSourceApi(),
//     responseHandler,
//   });
//
//   const heroes = responseHandler.data.heroes;
//   t.is(heroes.length, 4);
//   t.is(heroes[0].profile.str, '2');
// });
