
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
    });
};
