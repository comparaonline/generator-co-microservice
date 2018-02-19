'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  static get devDependencies() {
    return ['mocha', 'chai', '@types/mocha', '@types/chai'];
  }
  writing() {
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      scripts: {
        test: 'NODE_ENV=test mocha'
      }
    }, currentPkg);

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    mkdirp.sync(this.destinationPath('test'));
    this.fs.copy(
      this.templatePath('mocha.opts'),
      this.destinationPath('test/mocha.opts')
    )

    this._testInitialization();
  }

  _testInitialization() {
    const additionalParts = [];
    if (this.options.hasDependency('sequelize')) {
      mkdirp.sync(this.destinationPath('src/test-helpers'));
      this.fs.copy(
        this.templatePath('sequelize.ts'),
        this.destinationPath('src/test-helpers/sequelize.ts')
      )
    }
    return additionalParts.join('\n')
  }
};