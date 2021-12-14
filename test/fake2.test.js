const Base64 = require('js-base64').Base64;
const axios = require('axios');

class SierraApi {
  constructor(conf) {
    this.conf = conf;
    let keyText = conf.credentials.apiKey + ':' + conf.credentials.clientSecret;
    this.encodedKey = Base64.encode(keyText);
    this.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async getToken() {
    try {
      let response = await axios({
        method: 'post',
        url: this.urlPrefix + this.conf.endpoints.token,
        headers: {
          Authorization: 'Basic ' + this.encodedKey,
        },
      });
      //   console.log(__filename);
      //   console.log('Response:', response);
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (err) {
      console.log(err);
    }
  }

  async patronFind(params) {
    return await this.query('/v5/patrons/find', params);
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: checkouts, holds, fines
    let endpoint = '/v5/patrons/' + patronId + '/' + queryType;
    return await this.query(endpoint);
  }

  async query(endpoint, params = {}, method = 'get') {
    let json = await axios({
      method: method,
      url: this.urlPrefix + endpoint,
      params: params,
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
      },
    });
    return json;
  }
}
/********************************* end API ****************************************/
/******************************* begin Driver *********************************/
class SierraDataGetter {
  constructor(conf) {
    // this.server = conf.server;
    // console.log('initializing: ' + conf.server);
    this.conf = conf;
    this.sierra = new SierraApi(this.conf);
  }
  createUserObject(userId) {
    this.user = {
      id: userId,
      display: {},
    };
  }
  async getPatronBaseInfo() {
    const params = {
      varFieldTag: 'u', //uid
      varFieldContent: 5, //this.user.id, //received as argument
      fields: 'moneyOwed,id',
    };
    let res = await this.sierra.patronFind(params);
    this.user.numericId = res.data.id;
    this.user.display.moneyOwed = res.data.moneyOwed;
  }
}
/******************************* end Driver *********************************/
/******************************* begin test *********************************/

const fakeConf = {
  credentials: {
    apiKey: 'fakeKey',
    clientSecret: 'fakeSecret',
  },
  server: 'this.fake.edu',
  urlPath: '/v5/fakePath',
};
const getter = new SierraDataGetter(fakeConf);

const patronFindSpy = jest
  .spyOn(getter.sierra, 'patronFind')
  .mockImplementation(async () => {
    return Promise.resolve({
      data: { id: 12345, moneyOwed: 1.25 },
    });
  });

describe('Sierra Fake Test', () => {
  it('should do basic addition', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('Getter constructor', () => {
  it('should have a this.conf after initialization', () => {
    expect(getter.conf.credentials.apiKey).toBe('fakeKey');
  });
});

describe('SierraDataGetter getPatronBaseData', () => {
  it('should bring back some data', async () => {
    getter.createUserObject('fakeUserId'); // creates the getter.user object that will be used in next fn
    await getter.getPatronBaseInfo();
    expect(patronFindSpy).toHaveBeenCalledTimes(1);
  });
});
