const test = require('ava');
const {callForHeroes} = require('../hero.service');


const heroSourceApi = {
  requestHeroesCalled: false,
  async requestHeroes() {
    this.requestHeroesCalled = true;
    return {
      data: [
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
    };
  }
};

test('get heroes should return 2 heroes', async t => {
  const {heroes} = await callForHeroes({heroSourceApi});
  t.is(heroes.length, 4);
  t.is(heroes[0].id, '1');
  t.is(heroes[0].name, 'Daredevil');
});
test('get heroes should let hero-source-api-called', async t => {

  const {heroes} = await callForHeroes({heroSourceApi});
  t.is(heroes.length, 4);
  t.is(heroSourceApi.requestHeroesCalled, true);
});


