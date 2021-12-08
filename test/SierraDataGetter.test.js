const SierraDataGetter = require('../sierra/SierraDataGetter');
const SierraApi = require('../sierra/SierraApi');
const yaml = require('js-yaml');
const fs = require('fs');
// Read test confs
const fakeSierraConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeSierraConfig.yml', 'utf8')
);

describe('SierraDataGetter: constructor', () => {
  beforeEach(() => {
    getter = new SierraDataGetter(fakeSierraConf.sierra);
  });
  it('should take in a config file and set it to this.conf', () => {
    expect(getter.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(getter.conf.endpoints.token).toBe('/v5/token');
  });
  it('should initialize a new SierraApi with that config', () => {
    expect(getter.sierra).toBeInstanceOf(SierraApi);
  });
});

// describe('SierraDataGetter: getUserData', () => {
//   it('should get a SierraApi token', () => {});
//   it('should initialize this.user', () => {});
//   it('should call getPatronBaseInfo', () => {});
//   it('should call getNumCheckouts', () => {});
//   it('should call getNumHolds', () => {});
//   it('should return this.user.display', () => {});
// });

// describe('SierraDataGetter: getPatronBaseInfo', () => {});
// describe('SierraDataGetter: getNumCheckouts', () => {});
// describe('SierraDataGetter: getNumHolds', () => {});
