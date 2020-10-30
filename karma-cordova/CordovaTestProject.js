let FileSystem = require('fs-extra')
let Path = require('path');
// let execa = require('execa');
const ChildProcess = require('child_process');

class CordovaTestProject {
    constructor(listenAddress, port) {
        this._userHome = process.env.HOME;
        this._testProjectDirectory = Path.resolve(this._userHome, './.cordovaKarmaRunner');
        this._listenAddress = listenAddress;
        this._port = port;
        this._debug = false;
    }

    enableDebug(flag) {
        this._debug = flag;
    }

    async install() {
        await FileSystem.emptyDir(this._testProjectDirectory);
        
        let templateProjectPath = Path.resolve(__dirname, 'testProject');
        await FileSystem.copy(templateProjectPath, this._testProjectDirectory);

        let configPath = Path.resolve(this._testProjectDirectory, 'config.xml');
        let config = await FileSystem.readFile(configPath);
        config = config.toString();

        config = config.replace(/\$ADDRESS/, this._listenAddress)
                       .replace(/\$PORT/, this._port);

        await FileSystem.writeFile(configPath, config);

        return this;
    }

    async addPlugins(plugins) {
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            await this._runCommand('cordova', [
                'plugin', 'add', plugin
            ]);
        }

        return this;
    }

    async build(platform, version = '') {
        if (version) {
            platform += `@${version}`;
        }

        await this._runCommand('cordova', [
            'platform',
            'add',
            platform
        ]);

        await this._runCommand('cordova', [
            'build', 'android'
        ]);
    }

    getProjectDirectory() {
        return this._testProjectDirectory;
    }

    async _runCommand(command, args) {
        return new Promise((resolve, reject) => {
            ChildProcess.execFile(command, args, {
                cwd: this._testProjectDirectory
            },
            (e, stdout, stderr) => {
                if (e) {
                    return reject(e);
                }

                process.stderr.write(stderr);
                if (this._debug) {
                    process.stdout.write(stdout);
                }
                resolve(stdout);
            });
        });
    }
}

module.exports = CordovaTestProject;
