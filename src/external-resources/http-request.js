/**
 * @type {(function(*=, *=): (*|undefined))|*|{}}
 * @references https://www.npmjs.com/package/got
 */
const got = require('got');

async function getRequest({ url, headers }) {
  const resp = await got(url, { headers, json: true });
  const { body, statusCode, statusMessage } = resp;
  return { body, statusCode, statusMessage };
}
async function postRequest({ url, headers, data }) {
  const resp = await got.post(url, { headers, json: true, body: data });
  const { body, statusCode, statusMessage } = resp;
  return { body, statusCode, statusMessage };
}


module.exports = {getRequest, postRequest};

