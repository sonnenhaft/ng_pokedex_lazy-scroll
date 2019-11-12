angular.module('pokedex-demo', [
    'pokedex',
    'pokedex.pokedex-header',
    'pokedex.pokemon-resource',
    'pokedex-demo.templates'
]).config(["$urlRouterProvider", "pokemonResourceProvider", function ($urlRouterProvider, pokemonResourceProvider) {
    $urlRouterProvider.otherwise('/pokedex');
    pokemonResourceProvider.setMaxPokemons(718);
}]);

angular.module('pokedex-demo.templates', []);
angular.module('pokedex.pokemon-resource', [
    'ngResource'
]).provider('pokemonResource', function () {
    var maxPokemons = 720;

    this.setMaxPokemons = function (_maxPokemons) {
        maxPokemons = _maxPokemons;
    };

    this.$get = ["$resource", "$http", function ($resource, $http) {
        var pokeApi = 'http://pokeapi.co';
        var pokemonResource = $resource(pokeApi + '/api/v1/pokemon/:id', {id: '@id'}, {
            'get': {cache: true, interceptor: {response: responseInterceptor}}
        });

        pokemonResource.prototype.$loadFirstDescription = function () {
            var pokemon = this;
            return this.$promise.then(function () {
                return $http.get(pokeApi + pokemon.descriptions[0].resource_uri);
            }).then(function (response) {
                pokemon.description = response.data.description;
            });
        };

        pokemonResource.MAX_POKEMONS = maxPokemons;
        return pokemonResource;
    }];

    function responseInterceptor(pokemon) {
        pokemon = pokemon.resource;
        var id = pokemon.national_id;
        if (id < 10) {
            id = '00' + id;
        } else if (id < 100) {
            id = '0' + id;
        }
        pokemon.types = pokemon.types.reverse();
        pokemon.$id = id;
        pokemon.image = 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/' + id + '.png';
        pokemon.largeImage = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + id + '.png';
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
angular.module('pokedex', [
    'ui.scroll.jqlite',
    'pokedex.pokemon-resource',
    'pokedex.pokemon-card',
    'pokedex.pokemon-info',
    'ui.router'
]).directive('pokedex', ["pokemonResource", "$stateParams", function (pokemonResource, $stateParams) {
    return {
        templateUrl: 'app/pokedex/pokedex.html',
        controller: ["$scope", function ($scope) {
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
        }]
    };
}]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('pokedex', {
        url: '/pokedex?:infinitive', template: '<pokedex></pokedex>'
    });
}]);
angular.module('pokedex.pokedex-header', []).directive('pokedexHeader', function(){
   return {templateUrl: 'app/pokedex-header/pokedex-header.html'};
});
angular.module('pokedex.is-image-loaded', [
]).directive('isImageLoaded', function () {
    return function ($scope, $element, $attrs) {
        $element.bind('load', function () {
            $element.off();
            $scope[$attrs.isImageLoaded] = true;
            $scope.$digest();
        });
    };
});
angular.module('pokedex.pokemon-card', [
    'pokedex.is-image-loaded'
]).directive('pokemonCard', function () {
    return {
        scope: {pokemon:'=pokemonCard', large: '='},
        templateUrl: 'app/pokemon-card/pokemon-card.html'
    };
});
angular.module('pokedex.pokemon-info', [
    'pokedex.pokemon-card',
    'pokedex.pokemon-resource',
    'ui.router'
]).directive('pokemonInfo', ["pokemonResource", "$stateParams", "$timeout", function (pokemonResource, $stateParams, $timeout) {
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
}]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('pokemon', {
        url: '/pokemon?:id', template: '<pokemon-info></pokemon-info>'
    });
}]);
angular.module("pokedex-demo.templates").run(["$templateCache", function($templateCache) {$templateCache.put("app/pokedex/pokedex.html","<div class=\"pokedex\">\n    <h1>POK&Eacute;DEX</h1>\n\n    <div ng-repeat=\"pokemon in pokemons\" pokemon-card=\"pokemon\" ui-sref=\"pokemon({id: $index + 1})\" class=\"float-hook\"></div>\n    <div ng-if=\"loadMore\">\n        <div class=\"float-hook\" ui-scroll=\"pokemon in pokemonSource\" buffer-size=\"20\" padding=\"1.8\"\n             pokemon-card=\"pokemon\" ui-sref=\"pokemon({id: $index + pokemons.length})\">\n        </div>\n    </div>\n    <div class=\"clear-float-hook\">\n        <button ng-click=\"loadMore = true\" ng-hide=\"loadMore\" class=\"load-more\">load more</button>\n    </div>\n</div>");
$templateCache.put("app/pokedex-header/pokedex-header.html","<div class=\"pokedex-header\">\n    <img src=\"favicon.ico\"/>\n    <a ui-sref=\"pokedex\">POK&Eacute;DEX</a>\n</div>\n<div class=\"pokedex-header-height\"></div>\n");
$templateCache.put("app/pokemon-card/pokemon-card.html","<div class=\"ajax-loader\" ng-hide=\"pokemon.$resolved && imageLoaded\"></div>\n<div ng-class=\"{\'opacity-animation\': pokemon.$resolved, \'transparent\': !pokemon.$resolved}\" id=\"pokemonCard{{::pokemon.$id}}\">\n    <div class=\"pokemons-header\">#{{::pokemon.$id}} <b>{{::pokemon.name}}</b></div>\n    <div class=\"pokemon-image\"  ng-class=\"{\'opacity-animation\': imageLoaded, \'transparent\': !imageLoaded}\">\n        <img ng-src=\"{{large ? pokemon.largeImage : pokemon.image}}\" is-image-loaded=\"imageLoaded\"/>\n    </div>\n\n    <div class=\"type-buttons\">\n        <div class=\"left\" ng-class=\"::pokemon.firstType\">{{::pokemon.firstType}}</div>\n        <div class=\"right\" ng-show=\"::pokemon.secondType\" ng-class=\"::pokemon.secondType\">{{::pokemon.secondType}}</div>\n    </div>\n</div>");
$templateCache.put("app/pokemon-info/pokemon-info.html","<div class=\"pokemon-info\">\n    <div class=\"control-buttons\">\n        <div class=\"left\" ui-sref=\"pokemon({id: prevId})\">\n            <span ng-class=\"{\'opacity-animation\': prev.$resolved, \'transparent\': !prev.$resolved}\">\n                <span class=\"pokemon-id animate-show\">#{{prev.$id}}</span> {{prev.name}}\n            </span>\n        </div>\n        <div class=\"right\" ui-sref=\"pokemon({id: nextId})\">\n            <span ng-class=\"{\'opacity-animation\': next.$resolved, \'transparent\': !next.$resolved}\">\n                {{next.name}} <span class=\"pokemon-id\" ng-show=\"next.$resolved\">#{{next.$id}}</span>\n            </span>\n        </div>\n    </div>\n\n    <div class=\"sub-wrapper\">\n        <div class=\"header\" ng-class=\"{\'opacity-animation\': pokemon.$resolved, \'transparent\': !pokemon.$resolved}\">#{{::pokemon.$id}} <b>{{::pokemon.name}}</b></div>\n        <div class=\"card-wrapper\">\n            <div pokemon-card=\"pokemon\" large=\"true\"></div>\n            <div class=\"description\" ng-class=\"{\'opacity-animation\': pokemon.description, \'transparent\': !pokemon.description}\">\n                {{pokemon.description}}\n            </div>\n        </div>\n        <div style=\"display: inline-block\">\n            <div class=\"abilities-block\">\n                <div class=\"info\">Height <div class=\"sub-info\">{{pokemon.height/10}} m</div></div>\n                <div class=\"info\">Category <div class=\"sub-info\">Speed</div></div>\n                <div class=\"info\">Weight <div class=\"sub-info\">{{pokemon.weight/10}} kg</div></div>\n                <div class=\"info\">Abilities <div class=\"sub-info capitalize\">\n                    <span ng-repeat=\"ability in pokemon.abilities | limitTo: 3 track by ability.name\">{{ability.name}} </span>\n                </div></div>\n                <div class=\"info\">Gender <div class=\"sub-info\">F / M</div></div>\n            </div>\n            <div class=\"chart-block\">\n                Base Stats\n                <svg width=\"340\" height=\"160\">\n                    <g ng-repeat=\"field in fields\" ng-attr-transform=\"translate({{58*$index}}, 10)\">\n                        <rect  height=\"120\" width=\"50\" height=\"500\" fill=\"white\"></rect>\n                        <rect  height=\"0\" y=\"120\"  ng-attr-height=\"{{pokemon[field.key] || 0}}\" ng-attr-y=\"{{120-pokemon[field.key]}}\" width=\"50\" fill=\"#4A90E2\">\n                        </rect>\n                        <g transform=\"translate(25,135)\" font-size=\"12\" text-anchor=\"middle\">\n                            <text>{{field.value}}</text>\n                            <text y=\"12\">{{field.value2}}</text>\n                        </g>\n                    </g>\n                </svg>\n            </div>\n        </div>\n\n        <h1>Moves</h1>\n\n        <div class=\"move-groups\">\n            <div ng-repeat=\"moves in pokemon.groupedMoves\" class=\"move-group\">\n                <!--limiting to 5 in here because it is just a demo app-->\n                <div ng-repeat=\"move in moves | limitTo : 5\" class=\"move\" ng-class=\"move.learn_type\">\n                    {{::move.name}}\n                </div>\n            </div>\n            <div>\n                <button ui-sref=\"pokedex({infinitive: true})\" class=\"explore-more\">EXPLORE MORE POKEMON</button>\n            </div>\n        </div>\n    </div>\n\n</div>\n");}]);
angular.module('pokedex-demo-constant', [])
.constant('name', "pokedex-demo")
.constant('version', "0.0.1")
.constant('description', "Demo pokemon app")
.constant('scripts', {"bower-install":"node node_modules/bower/bin/bower install","start":"node node_modules/gulp/bin/gulp.js default","build":"node node_modules/gulp/bin/gulp.js build"})
.constant('author', "Vladimir Shein")
.constant('license', "MIT")
.constant('devDependencies', {"bower":"~1.3.12","gulp":"~3.8.10","gulp-angular-templatecache":"~1.5.0","gulp-autoprefixer":"~2.1.0","gulp-clean":"~0.3.1","gulp-clone":"~1.0.0","gulp-connect":"~2.2.0","gulp-copy":"0.0.2","gulp-css-url-adjuster":"~0.2.3","gulp-inject":"~1.0.2","gulp-jshint":"~1.9.0","gulp-jshint-xml-file-reporter":"^0.5.1","gulp-livereload":"~3.2.0","gulp-minify-css":"~0.3.11","gulp-minify-html":"~0.1.7","gulp-ng-annotate":"~0.4.3","gulp-ng-config":"~1.0.0","gulp-nightwatch":"^0.2.6","gulp-notify":"^2.2.0","gulp-open":"~0.2.8","gulp-processhtml":"^1.0.2","gulp-protractor":"^1.0.0","gulp-rename":"~1.2.0","gulp-sourcemaps":"~1.2.8","gulp-stylus":"^2.1.1","gulp-uglify":"~1.0.2","gulp-usemin":"~0.3.8","gulp-util":"^3.0.4","jasmine-reporters":"^2.0.7","jshint-stylish":"~1.0.0","karma":"~0.12.24","karma-chrome-launcher":"~0.1.2","karma-coverage":"~0.2.7","karma-jasmine":"~0.2.3","karma-js-coverage":"~0.2.0","karma-junit-reporter":"^0.3.8","karma-ng-html2js-preprocessor":"~0.1.0","karma-phantomjs-launcher":"~0.1.2","phantomjs":"~1.9.15","protractor":"^3.0.0","run-sequence":"~1.0.2"})
.constant('pokedexDemoVersion', "0.0.1");
