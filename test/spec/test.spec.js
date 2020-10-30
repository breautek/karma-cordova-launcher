
describe('Cordova', () => {
    it('is cordova object available?', () => {
        expect(window.cordova).toBeTruthy();
    });
});


describe('Device', () => {
    beforeAll((done) => {
        document.addEventListener('deviceready', () => {
            done();
        });
    })
    it('platform should be android', () => {
        expect(window.device.platform).toBe('Android');
    });
});
