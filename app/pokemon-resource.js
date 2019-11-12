angular.module('pokedex.pokemon-resource', [
    'ngResource'
]).provider('pokemonResource', function () {
    var maxPokemons = 720;

    this.setMaxPokemons = function (_maxPokemons) {
        maxPokemons = _maxPokemons;
    };

    this.$get = function ($resource, $http) {
        var pokemonResource = $resource('https://pokeapi.co/api/v2/pokemon/:id', {id: '@id'}, {
            'get': {cache: true, interceptor: {response: responseInterceptor}}
        });

        pokemonResource.prototype.$loadFirstDescription = function () {
            var pokemon = this;
            return this.$promise.then(function () {
                return $http.get(pokemon.species.url);
            }).then(function (response) {
                pokemon.description = response.data.description;
            });
        };

        pokemonResource.MAX_POKEMONS = maxPokemons;
        return pokemonResource;
    };

    function responseInterceptor(pokemon) {
        pokemon = pokemon.resource;
        var id = pokemon.id;

        pokemon.types = pokemon.types.reverse();
        pokemon.$id = id;
        pokemon.image = pokemon.sprites.front_default;
        pokemon.largeImage = pokemon.sprites.front_shiny;
        pokemon.firstType = pokemon.types[0].name;
        if (pokemon.types[1]) {
            pokemon.secondType = pokemon.types[1].name;
        }
        var map = {};
        pokemon.groupedMoves = pokemon.moves.reduce(function (array, move) {
            var type = move.learn_type;
            if (!map[type]) {
                var groupedArray = [];
                map[type] = groupedArray;
                array.push(groupedArray);
            }
            map[type].push(move);
            return array;
        }, []);
        return pokemon;
    }
});