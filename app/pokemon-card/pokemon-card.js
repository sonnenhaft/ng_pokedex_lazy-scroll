angular.module('pokedex.pokemon-card', [
    'pokedex.is-image-loaded'
]).directive('pokemonCard', function () {
    return {
        scope: {pokemon:'=pokemonCard', large: '='},
        templateUrl: 'app/pokemon-card/pokemon-card.html'
    };
});