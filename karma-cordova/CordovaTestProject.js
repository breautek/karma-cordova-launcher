let FileSystem = require('fs-extra')
let Path = require('path');
// let execa = require('execa');
const ChildProcess = require('child_process');

class CordovaTestProject {
    constructor() {
        this._userHome = process.env.HOME;
        this._testProjectDirectory = Path.resolve(this._userHome, './.cordovaKarmaRunner');
    }

    async build(platform, version = '') {
        await FileSystem.emptyDir(this._testProjectDirectory);
        
        let templateProjectPath = Path.resolve(__dirname, 'testProject');
        await FileSystem.copy(templateProjectPath, this._testProjectDirectory);

        if (version) {
            platform += `@${version}`;
        }

        return new Promise((resolve, reject) => {
            ChildProcess.execFile('cordova', [
                'platform',
                'add',
                platform
            ], {
                cwd: this._testProjectDirectory
            }, (e, stdout, stderr) => {
                if (e) {
                    return reject(e);
                }

                // process.stdout.write(stdout);
                process.stderr.write(stderr);

                ChildProcess.execFile('cordova', [
                    'build',
                    'android'
                ], {
                    cwd: this._testProjectDirectory
                }, (e, stdout, stderr) => {
                    if (e) {
                        return reject(e);
                    }
    
                    // process.stdout.write(stdout);
                    process.stderr.write(stderr);
                    resolve();
                });
            })
        });
    }

    getProjectDirectory() {
        return this._testProjectDirectory;
    }
}

module.exports = CordovaTestProject;
