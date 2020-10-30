
module.exports = function(config) {
    config.set({
        port: 9877,
        frameworks: ['cordova', 'jasmine'],
        browsers : ['cordova-android'],
        singleRun: true,
        files : [{
            pattern: 'spec/**/*.spec.js',
            watched: true
        }],
        cordova: {
            port: 8000,
            plugins: [
                'cordova-plugin-device'
            ],
            platformVersion: 'nightly',
            debug: true
        }
    });
};
