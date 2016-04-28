angular.module('pokedex-demo', [
    'pokedex',
    'pokedex.pokedex-header',
    'pokedex.pokemon-resource',
    'pokedex-demo.templates'
]).config(function ($urlRouterProvider, pokemonResourceProvider) {
    $urlRouterProvider.otherwise('/pokedex');
    pokemonResourceProvider.setMaxPokemons(718);
});

angular.module('pokedex-demo.templates', []);