describe('pokedex', function () {
    beforeEach(module('pokedex', function ($provide) {
        $provide.value('pokemonResource', {
            'get': function () {return {$resolved: true,name: 1};}
        });
    }));

    it('should build directive by angular', inject(function (directiveBuilder) {
        var directive = directiveBuilder.build('<pokedex ui-scroll-viewport style="height: 1000px;display: block" >pokedex>');
        directive.scope.$digest();
        expect(directive.element.text()).toContain('POKEDEX');
    }));

});