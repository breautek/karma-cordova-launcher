const execa = require("execa");
// const ChildProcess = require('child_process');
const CordovaTestProject = require("./CordovaTestProject");

var createPattern = function (pattern) {
    return { pattern: pattern, included: true, served: true, watched: false };
}

async function initCordova(files) {
    files.unshift(createPattern('http://192.168.50.11:8000/android/www/cordova.js'));

    let testProject = new CordovaTestProject();
    await testProject.build('android');

    execa('cordova', ['serve', 'android'], {
        cwd: testProject.getProjectDirectory()
    }).stdout.pipe(process.stdout);
}

initCordova.$inject = ['config.files'];

module.exports = {
    'framework:cordova': ['factory', initCordova]
};
