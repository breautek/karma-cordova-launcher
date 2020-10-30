const Path = require('path');
const ChildProcess = require('child_process');

var CordovaAndroid = function (baseLauncherDecorator, args) {
    baseLauncherDecorator(this);
    console.log('ARGS', args);

    this.on('start', (pageUrl) => {
        console.log('STARTING', pageUrl);
        ChildProcess.execFile('cordova', [
            'emulate',
            'android'
        ], {
            cwd: Path.resolve(process.env.HOME, './.cordovaKarmaRunner')
        }, (e, stdout, stderr) => {

            // process.stdout.write(stdout);
            process.stderr.write(stderr);
        });
    });
};

CordovaAndroid.prototype = {
    name: 'cordova-android',
  
    // DEFAULT_CMD: {
        // linux: `cd ${Path.resolve(process.env.HOME, './.cordovaKarmaRunner')} && cordova emulate android`
        // linux: getBin(['google-chrome', 'google-chrome-stable'])
    //   darwin: getChromeDarwin('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    //   win32: getChromeExe('Chrome')
    // }
    // ENV_CMD: 'CHROME_BIN'
  }

CordovaAndroid.$inject = ['baseLauncherDecorator', 'args']

module.exports = {
    'launcher:cordova-android': ['type', CordovaAndroid]
};
