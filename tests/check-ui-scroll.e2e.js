describe('infinitive scroll', function () {
    beforeEach(function () {
        browser.get('http://localhost:' + require('../resources/getPort.js'));
        browser.waitForAngular();
    });

    it('at least one card is present', function () {
        expect($('[pokemon-card]').isDisplayed()).toEqual(true);
    });

    it('load more cards', function () {
        expect($('#pokemonCard017').isPresent()).toEqual(false);
        browser.executeScript('window.scrollTo(0,10000);').then(function () {
            $('.load-more').click();
            return browser.executeScript('window.scrollTo(0,10000);');
        }).then(function () {
            return browser.sleep(2000);
        }).then(function () {
            expect($('#pokemonCard017').isPresent()).toEqual(true);
        });
    });
});