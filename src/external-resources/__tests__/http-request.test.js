const test = require('ava');
const nock = require('nock');
const {getRequest, postRequest} = require('../http-request');

const HOST = 'https://hahow-recruit.herokuapp.com';
const getURL = path => `${HOST}/${path}`;

test('test get request should return a body including four elements', async t => {
  const URL_PATH = getURL('heroes');
  nock(HOST)
    .get('/heroes')
    .reply(200,
      [
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
      ],
    );
  const {body} = await getRequest({url: URL_PATH});

  t.is(body.length, 4);
  t.is(body[3].id, '4');
});

test('test post request should return a body including four elements', async t => {
  const URL_PATH = getURL('auth');
  const postData = {
    name: "hahow",
    password: "rocks"
  };
  nock(HOST)
    .post('/auth', postData)
    .reply(200
    );
  const {statusCode} = await postRequest({url: URL_PATH, data: postData});

  t.is(statusCode, 200);
});

test('test post request should return 401', async t => {
  const URL_PATH = getURL('auth');
  const postData = {
    name: "hahow",
    password: "rocksss"
  };
  nock(HOST)
    .post('/auth', postData)
    .reply(401
    );
  const {statusCode} = await postRequest({url: URL_PATH, data: postData});
  t.is(statusCode, 401);
});
