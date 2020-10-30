const execa = require("execa");
// const ChildProcess = require('child_process');
const CordovaTestProject = require("./CordovaTestProject");
const OS = require('os');

const createPattern = function (pattern) {
    return { pattern: pattern, included: true, served: true, watched: false };
}

const getPrivateAddress = function() {
    const nets = OS.networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                let octaves = net.address.split('.');
                // 10.0.0.0 - 10.255.255.255
                if (octaves[0] === '10') {
                    return net.address;
                }
                // 172.16.0.0 - 172.31.255.255
                else if (octaves[0] === '172' && parseInt(octaves[1]) >= 16 && parseInt(octaves[1]) <= 31) {
                    return net.address;
                }
                // 192.168.0.0 - 192.168.255.255
                else if (octaves[0] === '192' && octaves[1] === '168') {
                    return net.address;
                }
            }
        }
    }

    return null;
}

async function initCordova(files, config, karmaPort, karmaListenAddress) {
    console.log('CORDOVA CONFIG', config);

    if (!config) {
        config = {};
    }

    let address = config.address || getPrivateAddress();
    let port = config.port || 8000;

    if (karmaListenAddress === '0.0.0.0') {
        karmaListenAddress = address;
    }

    files.unshift(createPattern(`http://${address}:${port}/android/www/cordova.js`));

    let testProject = new CordovaTestProject(karmaListenAddress, karmaPort);
    
    if (config.debug) {
        testProject.enableDebug(true);
    }

    await testProject.install();
    await testProject.addPlugins(config.plugins || []);
    await testProject.build('android', config.platformVersion);

    execa('cordova', ['serve', 'android'], {
        cwd: testProject.getProjectDirectory()
    }).stdout.pipe(process.stdout);
}

initCordova.$inject = ['config.files', 'config.cordova', 'config.port', 'config.listenAddress'];

module.exports = {
    'framework:cordova': ['factory', initCordova]
};
