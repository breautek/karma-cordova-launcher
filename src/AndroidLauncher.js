
window.__karma__.start = function createStartFn (karma) {
    // This function will be assigned to `window.__karma__.start`:
    return function () {
        let cordovaScript = document.createElement('script');
        cordovaScript.src = 'http://localhost:8000/android/www/cordova.js';
        document.body.appendChild(cordovaScript);

        console.log(karma);
    }
}