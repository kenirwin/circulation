const SierraApi = require('./SierraApi');

module.exports = class SierraDataGetter {
  constructor(conf) {
    // this.server = conf.server;
    // console.log('initializing: ' + conf.server);
    this.conf = conf;
    this.sierra = new SierraApi(this.conf);
  }

  async getUserData(userId) {
    try {
      this.token = await this.sierra.getToken();
    } catch (err) {
      console.error('Error getting accessToken:', err);
    }

    this.user = {
      id: userId,
      display: {},
    };

    try {
      getPatronBaseInfo(); // gets numeric id, moneyOwed, account link
      getNumCheckouts();
      getNumHolds();
      return this.user.display;
    } catch (err) {
      console.error('Error getting patron info from Sierra');
    }
  }

  async getPatronBaseInfo() {}
  async getNumCheckouts() {}
  async getNumHolds() {}
};

//   try {
//     // define params to lookup user by userid
//     // it will return an "id" needed for subsequent API calls
//     const params = {
//       varFieldTag: 'u', //uid
//       varFieldContent: userId, //received as argument
//       fields: 'moneyOwed,id',
//     };
//     let res = await this.sierra.patronFind(params);
//     // console.log('Bibs response:', res.data);
//     let user = {
//       patronId: res.data.id,
//       display: {
//         moneyOwed: res.data.moneyOwed,
//         accountLink: 'https://' + this.conf.server + '/patroninfo.html',
//       },
//     };
//     let resCheckouts = await this.sierra.patronQuery(
//       'checkouts',
//       user.patronId
//     );
//     user.display.numCheckouts = resCheckouts.data.total;
//     let resHolds = await this.sierra.patronQuery('holds', user.patronId);
//     user.display.numHolds = resHolds.data.total;
//     // console.log(user.display);
//     // const sierraData = user.display;
//     return user.display;
//   } catch (err) {
//     console.log(err);
//   }
// }
