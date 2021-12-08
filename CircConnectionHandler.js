module.exports = class getCircData {
  constructor(circDataGetter) {
    if (typeof circDataGetter != 'function') {
      throw new SyntaxError('argument must be a function');
    }
    this.circDataGetter = circDataGetter;
  }
  getUserData(user) {
    return this.circDataGetter.getUserData(user);
  }
};
