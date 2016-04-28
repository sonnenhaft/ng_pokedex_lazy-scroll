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