const {SpecReporter} = require('jasmine-spec-reporter');
process.env.LANG = 'en'; // set your browser language
exports.config = {
  allScriptsTimeout: 110000,
  specs: [
    './e2e/**/*.e2e-spec.ts',
  ],
  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs-prebuilt').path,
    'phantomjs.cli.args': ['--remote-debugger-port=8081'],
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG'],
  },
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 50000,
    print: function () {}
  },
  useAllAngular2AppRoots: true,
  onPrepare: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  }
};
