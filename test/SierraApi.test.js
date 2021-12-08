const SierraApi = require('../sierra/SierraApi');
const yaml = require('js-yaml');
const fs = require('fs');
const Base64 = require('js-base64').Base64;
const axios = require('axios');
jest.mock('axios');

// Read test confs

const fakeSierraConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeSierraConfig.yml', 'utf8')
);

describe('SierraApi: constructor', () => {
  beforeEach(() => {
    api = new SierraApi(fakeSierraConf.sierra);
  });
  it('should assign the passed conf variables to this.conf', () => {
    expect(api.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(api.conf.endpoints.token).toBe('/v5/token');
  });
  it('should save a correctly encoded key from the provided credentials', () => {
    let decodedKey = Base64.decode(api.encodedKey);
    expect(decodedKey).toBe('fakeApiKey:fakeClientSecret');
  });
  it('should correctly derive a url prefix from the config', () => {
    expect(api.urlPrefix).toBe('https://fakeserver.univ.edu/iii/sierra-api');
  });
});

describe('SierraApi: getToken()', () => {
  beforeEach(async () => {
    api = new SierraApi(fakeSierraConf.sierra);
    axios.mockImplementation(async () =>
      Promise.resolve({
        data: {
          access_token: 'fakeAccessToken',
          token_type: 'bearer',
          expires_in: 3600,
        },
      })
    );
    response = await api.getToken();
  });
  it('should post an axios request to the url provided in the config file', () => {
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      method: 'post',
      url: 'https://fakeserver.univ.edu/iii/sierra-api/v5/token',
      headers: {
        Authorization: 'Basic ZmFrZUFwaUtleTpmYWtlQ2xpZW50U2VjcmV0',
      },
    });
  });
  it('should return the token value it gets from axios', () => {
    expect(response).toBe('fakeAccessToken');
  });
});
