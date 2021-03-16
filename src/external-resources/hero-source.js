const HTTP_OK_STATUS_CODE = 200;
const BIZZARRE_BACKEND_ERROR_CODE = 1000;

class HeroSourceApiResult {
  constructor(val) {
    this._val = val;
  }

  get val() {
    return this._val;
  }

  map(fn) {
    return fn(this.val);
  }

  isFailure() {
    return false;
  }

  isSuccess() {
    return !this.isFailure();
  }
}

class HeroSourceApiFailure {
  constructor(val) {

    this._val = val;
  }

  get val() {
    return this._val;
  }

  map() {
    return this.val;
  }

  isFailure() {
    return true;
  }

  isSuccess() {
    return !this.isFailure();
  }
}

const success = (val) => new HeroSourceApiResult(val);
const failure = ({statusCode, statusMessage}) => new HeroSourceApiFailure({statusCode, statusMessage});


class HeroSourceApi {
  constructor({httpRequest, host}) {
    this._httpRequest = httpRequest;
    this.host = host || 'https://hahow-recruit.herokuapp.com/heroes';
  }

  getURL(path) {
    return `${this.host}/${path}`;
  }

  get httpRequest() {
    return this._httpRequest;
  }


  async requestHeroes() {
    const {body, statusCode, statusMessage} = await this.httpRequest.getRequest({url: this.getURL('heroes')});
    if (statusCode === HTTP_OK_STATUS_CODE) {
      return success({heroes: body});
    }

    return failure({statusCode, statusMessage});
  }

  async requestHeroById(id) {
    const path = `heroes/${id}`;
    const {body, statusCode, statusMessage} = await this.httpRequest.getRequest({url: this.getURL(path)});

    if (body.code === BIZZARRE_BACKEND_ERROR_CODE) {
      return failure({
        statusCode: 500,
        statusMessage: 'Backend error'
      });
    }

    if (statusCode === HTTP_OK_STATUS_CODE) {
      return success({hero: body});
    }

    return failure({statusCode, statusMessage});
  }

  async requestHeroProfileById(id) {
    const path = `heroes/${id}/profile`;
    const {body, statusCode, statusMessage} = await this.httpRequest.getRequest({url: this.getURL(path)});

    if (statusCode === HTTP_OK_STATUS_CODE) {
      return success({profile: body});
    } else {
      return failure({statusCode, statusMessage});
    }
  }

  async requestAuth({name, password}) {
    if (!name) {
      throw new Error('Requires name');
    }
    if (!password) {
      throw new Error('Requires password');
    }
    const path = 'auth';
    const {statusCode, statusMessage} = await this.httpRequest.postRequest(
      {url: this.getURL(path), data: {name, password}}
    );

    if (statusCode === HTTP_OK_STATUS_CODE) {
      return success({authorized: true});
    }
    if (statusCode === 401) {
      return success({authorized: false, statusCode, statusMessage});
    }

    return failure({statusCode, statusMessage});
  }
}

module.exports = {HeroSourceApi, success, failure};
