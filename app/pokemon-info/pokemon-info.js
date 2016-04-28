angular.module('pokedex.pokemon-info', [
    'pokedex.pokemon-card',
    'pokedex.pokemon-resource',
    'ui.router'
]).directive('pokemonInfo', function (pokemonResource, $stateParams, $timeout) {
    function properID(id) {
        if (id > pokemonResource.MAX_POKEMONS) {
            return id -pokemonResource.MAX_POKEMONS;
        } else if (id < 1) {
            return pokemonResource.MAX_POKEMONS - id ;
        } else {
            return id;
        }
    }

    return {
        templateUrl: 'app/pokemon-info/pokemon-info.html',
        link: function ($scope) {
            $scope.fields = [
                {value: 'HP', key: 'hp'},
                {value: 'Attack', key: 'attack'},
                {value: 'Defense', key: 'defense'},
                {value: 'Special', value2: 'Attack', key: 'attack'},
                {value: 'Special', value2: 'Defense', key: 'defense'},
                {value: 'Speed', key: 'speed'}
            ];
            var id = $stateParams.id - 0;
            $scope.prevId = properID(id - 1);
            $scope.nextId = properID(id + 1);
            $scope.prev = pokemonResource.get({id: $scope.prevId});


            $timeout(function(){
                $scope.pokemon = pokemonResource.get({id: id});
                $scope.next = pokemonResource.get({id: $scope.nextId});
                $scope.pokemon.$loadFirstDescription();
                $scope.$digest();
            }, 0, false);
        }
    };
}).config(function ($stateProvider) {
    $stateProvider.state('pokemon', {
        url: '/pokemon?:id', template: '<pokemon-info></pokemon-info>'
    });
});