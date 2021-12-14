const SierraDataGetter = require('../sierra/SierraDataGetter');
const SierraApi = require('../sierra/SierraApi');
const yaml = require('js-yaml');
const fs = require('fs');
// const jest = require('jest');
// Read test confs
const fakeSierraConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeSierraConfig.yml', 'utf8')
);
const getter = new SierraDataGetter(fakeSierraConf.sierra);

const patronFindSpy = jest
  .spyOn(getter.sierra, 'patronFind')
  .mockImplementation(() => {
    return Promise.resolve({
      data: { id: 12345, moneyOwed: 1.25 },
    });
  });

describe('SierraDataGetter: constructor', () => {
  it('should take in a config file and set it to this.conf', () => {
    expect(getter.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(getter.conf.endpoints.token).toBe('/v5/token');
  });
  it('should initialize a new SierraApi with that config', () => {
    expect(getter.sierra).toBeInstanceOf(SierraApi);
  });
});

describe('SierraDataGetter: getUserData', () => {
  // beforeEach(async () => {
  //   // jest.clearAllMocks();
  //   // getter = new SierraDataGetter(fakeSierraConf.sierra);
  //   tokenSpy = jest.spyOn(getter.sierra, 'getToken').mockImplementation(() => {
  //     Promise.resolve({ data: { access_token: 'fakeAccessToken' } });
  //   });
  //   createUserSpy = jest
  //     .spyOn(getter, 'createUserObject')
  //     .mockImplementation(() => {});
  //   getPatronSpy = jest
  //     .spyOn(getter, 'getPatronBaseInfo')
  //     .mockImplementation(() => {});
  //   numCheckoutsSpy = jest
  //     .spyOn(getter, 'getNumCheckouts')
  //     .mockImplementation(() => {});
  //   numHoldsSpy = jest
  //     .spyOn(getter, 'getNumHolds')
  //     .mockImplementation(() => {});
  //   response = await getter.getUserData('username');
  // });
  // it('should get a SierraApi token', async () => {
  //   expect(tokenSpy).toHaveBeenCalledTimes(1);
  // });
  // it('should call createUserObject', () => {
  //   expect(createUserSpy).toHaveBeenCalledTimes(1);
  // });
  // it('should call getPatronBaseInfo', () => {});
  // it('should call getNumCheckouts', () => {});
  // it('should call getNumHolds', () => {});
  // it('should return this.user.display', () => {});
});

// describe('SierraDataGetter: createUserObject', () => {
//   // getter = new SierraDataGetter(fakeSierraConf.sierra);
//   getter.createUserObject('smithj');
//   expect(getter.user).toBeInstanceOf(Object);
//   expect(getter.user.id).toBe('smithj');
//   expect(getter.user.display).toEqual({});
// });

describe('SierraDataGetter: getPatronBaseInfo', () => {
  beforeEach(async () => {
    patronFindSpy.mockClear();
  });

  it('should call SierraApi.patronFind once', async () => {
    getter.createUserObject('smithj'); //require for

    await getter.getPatronBaseInfo();
    expect(patronFindSpy).toHaveBeenCalledTimes(1);
    expect(patronFindSpy).toHaveBeenCalledWith({
      varFieldTag: 'u',
      varFieldContent: 'smithj',
      fields: 'moneyOwed,id',
    });

    expect(getter.user.numericId).toBe(12345);
    expect(getter.user.display.moneyOwed).toBe(1.25);
  });
});
describe('SierraDataGetter: getNumCheckouts', () => {});
describe('SierraDataGetter: getNumHolds', () => {});

describe('Sierra Fake Test', () => {
  it('should do basic addition', () => {
    expect(1 + 1).toBe(2);
  });
});
