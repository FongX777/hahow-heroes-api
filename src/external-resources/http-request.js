/**
 * @type {(function(*=, *=): (*|undefined))|*|{}}
 * @references https://www.npmjs.com/package/got
 */
const got = require('got');

async function getRequest({url, headers}) {
  try {
    const resp = await got(url, {headers, json: true});
    const {body, statusCode, statusMessage} = resp;
    return {body, statusCode, statusMessage};
  } catch (error) {
    return {statusCode: error.statusCode, statusMessage: error.statusMessage};
  }
}

async function postRequest({url, headers, data}) {
  try {
    const resp = await got.post(url, {headers, json: true, body: data});
    const {body, statusCode, statusMessage} = resp;
    return {body, statusCode, statusMessage};
  } catch (error) {
    return {statusCode: error.statusCode, statusMessage: error.statusMessage};
  }
}


module.exports = {getRequest, postRequest};

