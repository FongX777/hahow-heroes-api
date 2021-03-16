const test = require('ava');
const nock = require('nock');
const httpRequest = require('../http-request');
const {HeroSourceApi} = require('../hero-source');

const HOST = 'https://hahow-recruit.herokuapp.com';


const heroFixtures = [
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
];
test('requestHeroes should return 4 heroes', async t => {
  nock(HOST)
    .get('/heroes')
    .reply(200,
      heroFixtures,
    );

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});
  const ResultOrFailure = await heroSourceApi.requestHeroes();
  t.false(ResultOrFailure.isFailure());
  t.is(ResultOrFailure.val.heroes.length, 4);
});

test('requestHeroById(1) should return the first hero ', async t => {
  nock(HOST)
    .get('/heroes/1')
    .reply(200, {
      id: "1",
      name: "Daredevil",
      image: "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
    });

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});

  const {hero} = await heroSourceApi.requestHeroById('1');
  t.is(hero.name, "Daredevil");
});

test('requestHeroById(1) but should return backend error ', async t => {
  nock(HOST)
    .get('/heroes/1')
    .reply(200, {
      code: 1000,
      message: "Backend error"
    });

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});

  const {code} = await heroSourceApi.requestHeroById('1');
  t.is(code, 1000);
});

test('requestHeroProfileById(1) should return the first hero\'s profile ', async t => {
  nock(HOST)
    .get('/heroes/1/profile')
    .reply(200, {
      str: 2,
      int: 7,
      agi: 9,
      luk: 7
    });

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});

  const {profile} = await heroSourceApi.requestHeroProfileById('1');
  t.deepEqual(profile, {
    str: 2,
    int: 7,
    agi: 9,
    luk: 7
  });
});

test('requestAuth should be authorized', async t => {
  nock(HOST)
    .post('/auth')
    .reply(200);

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});

  const {authorized} = await heroSourceApi.requestAuth({name: 'hahow', password: 'rocks'});
  t.is(authorized, true);
});

test('requestAuth with incorrect login data should be unauthorized', async t => {
  nock(HOST)
    .post('/auth')
    .reply(401, 'Unauthorized');

  const heroSourceApi = new HeroSourceApi({httpRequest, host: HOST});

  const {authorized} = await heroSourceApi.requestAuth({name: 'hahowsss', password: 'rocksssss'});
  t.is(authorized, false);
});
