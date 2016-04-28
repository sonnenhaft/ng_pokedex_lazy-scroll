angular.module('pokedex', [
    'ui.scroll.jqlite',
    'pokedex.pokemon-resource',
    'pokedex.pokemon-card',
    'pokedex.pokemon-info',
    'ui.router'
]).directive('pokedex', function (pokemonResource, $stateParams) {
    return {
        templateUrl: 'app/pokedex/pokedex.html',
        controller: function ($scope) {
            $scope.loadMore = $stateParams.infinitive;
            $scope.pokemons = [];
            $scope.loadPokemons = function (index, count, success) {
                var data = [];
                for (var i = index; i < index + count; i++) {
                    // you see this if in here because of little trouble in ui-scroll - it likes to go into negative area
                    if (i > 0) { data.push(pokemonResource.get({id: i + $scope.pokemons.length}));}
                }
                success(data);
            };

            for (var i = 1; i <= 16; i++) {
                $scope.pokemons.push(pokemonResource.get({id: i}));
            }
            $scope.pokemonSource = {get: $scope.loadPokemons};
        }
    };
}).config(function ($stateProvider) {
    $stateProvider.state('pokedex', {
        url: '/pokedex?:infinitive', template: '<pokedex></pokedex>'
    });
});