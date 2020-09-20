module.exports = class BaseDirectory {
  static shared;
  constructor(dir) {
    this.dir = dir;
    BaseDirectory.shared = this;
  }
};
