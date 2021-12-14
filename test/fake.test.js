class SierraApi {
  constructor(id) {
    this.id = id;
  }

  async getToken() {
    return Promise.resolve('myBogusToken');
  }

  async findPatron(name) {}
  async getPatronInfo() {
    let data = {
      data: {
        id: 123,
        moneyOwed: 3,
      },
    };
    return Promise.resolve(data);
  }
}

class SierraDriver {
  constructor() {
    this.num = Math.floor(Math.random() * 10);
    this.sierra = new SierraApi(this.num);
  }
  async getData() {
    return await this.sierra.getPatronInfo();
  }
}

const driver = new SierraDriver();

const dataSpy = jest
  .spyOn(driver.sierra, 'getPatronInfo')
  .mockImplementation(async () => {
    return Promise.resolve({
      data: {
        id: 5,
      },
    });
  });
describe('SierraDriver', () => {
  it('should have a sierra id from 0-9', () => {
    expect(driver.sierra.id).toBeLessThan(10);
    expect(driver.sierra.id).toBeGreaterThan(-1);
  });
  it('should use the spy on getData', async () => {
    let res = await driver.getData();
    expect(res.data.id).toBe(5);
    expect(dataSpy).toHaveBeenCalledTimes(1);
  });
});
